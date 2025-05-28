"""
Summary:
This script interacts with OpenAI's GPT-3.5-turbo model and MongoDB to generate responses for user questions. 
It uses a MongoDB collection for storing context information and leverages a RAG (Retrieval-Augmented Generation) approach to improve the model's responses.

The main steps include:
1. Retrieving a user question.
2. Obtaining context from MongoDB based on the user question.
3. Generating an embedding for the user question using an external service.
4. Using MongoDB's vector search to find relevant context documents.
5. Filtering the retrieved document and forming a string representation.
6. Making a RAG request to GPT-3.5-turbo, incorporating user question and context.
7. Handling rate limit errors with exponential backoff.
8. Displaying the generated answer.
"""
import time
import requests
from openai import OpenAI, OpenAIError, RateLimitError
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from config import Config

# Initialize OpenAI client
client = OpenAI()

# HuggingFace API configuraiton
hf_token = Config.HF_TOKEN
embedding_url = Config.EMBEDDING_URL

# MongoDB client setup
uri = Config.MONGODB_URI
db_name = Config.MONGODB_DATABASE
coll_name = Config.MONGODB_COLLECTION

# Create MongoDB client and connect to the server
mongo_client = MongoClient(uri, server_api=ServerApi('1'))
db = mongo_client[db_name]
collection = db[coll_name]

def generate_embedding(text: str) -> list[float]:
    # Generate embedding for the question using the HuggingFace API.
    # Parameters:
    #    - text: The input text for which embedding is generated.
    # Returns:
    #    - List[float]: The generated embedding.
    
    # API throttling config 
    max_retries = 5
    retry_delay = 5  # seconds

    for retry in range(max_retries): # API Retry Mechanism
        response = requests.post(
            embedding_url,
            headers={"Authorization": f"Bearer {hf_token}"},
            json={"inputs": text}
        )

        if response.status_code == 200:
            return response.json()

        if response.status_code == 503 and "Model is currently loading" in response.text:
            print(f"Model loading, retrying in {retry_delay} seconds... (Retry {retry + 1}/{max_retries})")
            time.sleep(retry_delay)
        else:
            raise ValueError(f"Request failed with status code {response.status_code}: {response.text}")

    raise ValueError("Exceeded maximum number of retries. Model did not become available.")

def get_context_from_mongodb(question):
    # Retrieve context from MongoDB based on the vector representation of thee user's question.
    # Parameters:
    #    - question: The user's question.
    # Returns:
    #    - str: String representation of relevant fields from the retrieved document.
    
    query_vector = generate_embedding(question)

    # MongoDB vector search aggregation pipeline
    pipeline = [
        {
            "$vectorSearch": {
                "queryVector": query_vector,
                "path": "embeddings.usecase_embedding",
                "numCandidates": 10,
                "limit": 1,
                "index": "usecase_vector_index",
            }
        }
    ]

    # Execute the aggregation pipeline
    results = collection.aggregate(pipeline)
    # Extract the result from the aggregation response
    result = list(results)

    if result:
        document = result[0]
        excluded_fields = []
        # Get all fields from the document, excluding specified ones
        filtered_fields = {key: value for key, value in document.get("usecase", {}).items() if key not in excluded_fields}
        # Convert the fields to a string
        result_string = "\n".join([f"{key}: {value}" for key, value in filtered_fields.items()])
        return result_string
    else:
        return ""

def make_rag_request(user_question, context, retry_count=0, temp=0.5, tokens=1000):
    # Make a RAG request to GPT-3.5-turbo with user's question and context.
    # Parameters:
    #    - user_question: The user's question.
    #    - context: Context document data from MongoDB.
    #    - retry_count: Number of retry attempts (used for exponential backoff).
    # Returns:
    #    - str: Generated answer from GPT-3.5-turbo.
    
    # Formulate the conversation with user's question and context
    conversation = [  
        {"role": "system", "content": "You are an experienced MongoDB sales executive, skilled in identifiying pains associated with using other databases and explaining how MongoDB and Atlas can address those pains and drive business value."},
        {"role": "assistant", "content": context},
        {"role": "user", "content": user_question + " Write it from MongoDB's perspective and make the content concise and suitable for C level audiences using headings, paragraphs, newlines and bullet points where it makes sense."}
    ]

    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=conversation,
            # temperature=temp,
            # max_tokens=tokens
        )
        # Extract the generated answer from the response
        answer = completion.choices[0].message
        return answer

    except RateLimitError as rle:
        # Exponential backoff before retrying
        retry_count += 1
        delay = 2 ** retry_count
        print(f"Rate Limit Exceeded. Retrying in {delay} seconds...")
        time.sleep(delay)
        return make_rag_request(user_question, context, retry_count)

    except OpenAIError as e:
        print(f"OpenAI Error: {e}")
        return "An error occurred."

def main():
    # Main function to execute the workflow:
    # 1. Prompt user for a question.
    # 2. Get context from MongoDB based on a vector representation of the the user's question.
    # 3. Make a RAG request to GPT-3.5-turbo.
    # 4. Display the generated answer.

    # Prompt the user for a question and store it in a string variable
    user_question = input("Enter your question: ")
    # Get context from MongoDB
    context = get_context_from_mongodb(user_question)
    # Make RAG request
    answer_object = make_rag_request(user_question, context)
    # Access the content attribute of ChatCompletionMessage
    answer_content = answer_object.content

    # Print the generated answer
    print(f"Answer: {answer_content}")

if __name__ == "__main__":
    main()
