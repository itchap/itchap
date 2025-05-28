from openai import OpenAI
client = OpenAI()

def get_embedding(text, model="text-embedding-3-small"):
   text = text.replace("\n", " ")
   return client.embeddings.create(input = [text], model=model).data[0].embedding

def main():
    # Prompt the user for a statement and store it in a string variable
    user_input = input("Enter your statement: ")
    result_embedding = get_embedding(user_input)
    print(f"Generated Embedding: {result_embedding}")

if __name__ == "__main__":
    main()
