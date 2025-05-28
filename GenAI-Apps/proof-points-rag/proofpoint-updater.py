# Import necessary libraries
import random
import time
import requests
import re
from datetime import datetime, timedelta
from faker import Faker
from geonamescache import GeonamesCache
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from config import Config

# Author: Peter Smith
# Summary:
# This script generates and inserts synthetic proof point data into a MongoDB collection.
# Proof points represent success stories of MongoDB Atlas adoption by companies, including
# details about the company, use cases, challenges, solutions, metrics, and other relevant information.

# Library Initialization:
# - `Faker` is used to generate fake data, including company names, addresses, and various other details.
# - `GeonamesCache` is used to obtain geographical data for selecting random cities, countries, and continents.
# - `requests` is used for making HTTP requests to the Hugging Face API to generate text embeddings.
# - `MongoClient` and related classes from `pymongo` are used for connecting to MongoDB Atlas and interacting with the database.

# Hugging Face API and MongoDB Connection Details:
# - `hf_token` and `embedding_url` store access details for the Hugging Face API, specifically the sentence-transformers pipeline.
# - `uri`, `client`, `db`, and `collection` store MongoDB Atlas connection details and references to the target database and collection.

# Use configuration constants
uri = Config.MONGODB_URI
db_name = Config.MONGODB_DATABASE
coll_name = Config.MONGODB_COLLECTION
hf_token = Config.HF_TOKEN
embedding_url = Config.EMBEDDING_URL
num_proof_points = Config.NUM_PROOF_POINTS

# Initialize Faker for generating fake data
fake = Faker()
# Initialize GeoNamesCache
gc = GeonamesCache()

# Create a new MongoDB client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client[db_name]
collection = db[coll_name]

def generate_embedding(text: str) -> list[float]:
    """
    Generate embedding for the given text using the Hugging Face API.
    Args:
        text (str): Input text to generate embedding.
    Returns:
        list[float]: List of embeddings.
    """
    # Maximum number of retries and delay between retries
    max_retries = 5
    retry_delay = 5  # seconds

    for retry in range(max_retries):
        # Send a request to the Hugging Face API
        response = requests.post(
            embedding_url,
            headers={"Authorization": f"Bearer {hf_token}"},
            json={"inputs": text})
        # Check the response status code
        if response.status_code == 200:
            return response.json()
        # If the model is still loading, retry after delay
        if response.status_code == 503 and "Model is currently loading" in response.text:
            print(f"Model loading, retrying in {retry_delay} seconds... (Retry {retry + 1}/{max_retries})")
            time.sleep(retry_delay)
        else:
            # Raise an error for other status codes
            raise ValueError(f"Request failed with status code {response.status_code}: {response.text}")
    # If maximum retries reached without success, raise an error
    raise ValueError(f"Exceeded maximum number of retries. Model did not become available.")

# Iterate through each document in the collection
for document in collection.find():
    # Concatenate all text to be encoded for use case embedding
    usecase_concatenated_text = ''
    usecase_concatenated_text += 'Industry: ' + document["customer"]["industry"] + '; '
    usecase_concatenated_text += 'Type: ' + document["usecase"]["type"] + '; Title: ' + document["usecase"]["title"] + '; Overview:  ' + document["usecase"]["overview"] + '; '
    usecase_concatenated_text += 'Introduction: ' + document["usecase"]["introduction"]["heading"] + ' ' + ' '.join(document["usecase"]["introduction"]["paragraphs"]) + '; '
    # Add challenges to the concatenated text
    for challenge in document["usecase"].get("challenges", []):
        usecase_concatenated_text += 'The Challenge: ' + challenge["heading"] + ' ' + ' '.join(challenge["paragraphs"]) + '; '
    # Add solutions to the concatenated text
    for solution in document["usecase"].get("solutions", []):
        usecase_concatenated_text += 'The Solution: ' + solution["heading"] + ' ' + ' '.join(solution["paragraphs"]) + ' '
    
    # Generate embedding for the concatenated text
    embeddings_data = {
        "usecase_embedding": generate_embedding(usecase_concatenated_text)
    }
    
    # Update the document with the generated embeddings
    collection.update_one(
        {"_id": document["_id"]},
        {"$set": {"embeddings": embeddings_data}}
    )

# Print a message indicating the completion of updating documents with embeddings
print("Embeddings generated and updated for all documents in the MongoDB collection.")
