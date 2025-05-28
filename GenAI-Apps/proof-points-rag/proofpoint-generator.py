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

# List of the top 50 tech cities
tech_cities = [
    'San Francisco', 'Seattle', 'Austin', 'Chicago', 'Boston', 'Tel Aviv', 'London', 'Berlin', 'Paris', 'Amsterdam',
    'Stockholm', 'Barcelona', 'Hyderabad', 'Chennai', 'Pune', 'Mumbai', 'Singapore', 'Tokyo', 'Seoul',
    'Shanghai', 'Beijing', 'Sydney', 'Melbourne', 'Toronto', 'Vancouver', 'Dublin', 'Berlin', 'Munich',
    'Helsinki', 'Oslo', 'Copenhagen', 'Milan', 'Rome', 'Warsaw', 'Prague', 'Bucharest',
    'Budapest', 'Vienna', 'Brussels', 'Lisbon', 'Porto', 'Barcelona', 'Stockholm', 'Cape Town', 'Johannesburg'
]

# List of MongoDB Atlas Products
products_list = [
    ("MongoDB Atlas", 20), ("SQL API", 3), ("Data Federation", 2), ("Atlas Search", 15), ("Atlas Vector Search", 10),
    ("Atlas Stream Processing", 5), ("Atlas Datalake", 4), ("Atlas Online Archive", 15), ("Atlas Triggers & Functions", 5),
    ("Atlas Realtime Analytics", 5), ("Atlas Charts", 5), ("Atlas Sync with Realm DB", 3),
]

# List of MongoDB Services
services_list = [
    ("Pro Support", 20), ("PS", 5), ("Partner SI", 1),
]

# List of MongoDB Sales Motions
sales_motions = [
    ("Migrate", 10), ("Replace", 8), ("Launch", 5), ("Select", 3)
]

# List of MongoDB Value Drivers
value_drivers = [
    "Maximize Competitive Advantage to Drive Growth", "Accelerate Time to Value",
    "Lower Total Cost of Ownership", "Reduce Risk for Business Applications"
]

# List of Applicaiton Usecases
usecase_types = [
    "eCommerce", "Blockchain", "Catalog", "Content Management", "Internet of Things (IoT)", "Machine Learning / AI", "Mainframe Offloading",
    "Mobile", "Payments", "Personalization", "Real-time Analytics", "Security and Fraud Apps", "Single View", "Customer Data Management", 
    "Big Data", "Cybersecurity", "Data Hub", "eCommerce", "Blockchain", "Mainframe Offload"
]

# List of Industry types
industry_types = [
    "Aerospace and Defense", "Automotive", "Banks and Financial Services", "Civic, Non-profit, and Memberships Groups", "Computer Hardware",
    "Computer Software", "Construction and Building Materials", "Consumer Products", "Consumer Services", "Corporate Services",
    "Energy and Environment", "Food and Beverages", "Government", "Hospital and Healthcare", "High Tech and Electronics", 
    "Industrial Manufacturing and Services", "Insurance", "Leisure, Sports, and Recreation", "Media and Entertainment", "Oil and Gas", 
    "Pharmaceuticals and Biotech", "Real Estate Services", "Retail and eCommerce", "Technology", "Telecommunications", "Transportation and Travel"
]

# List of customer persona types
role_types = [
    "CPO", "CSO", "VP of Product Mgmt", "Director of Product", "Group Product Man.", "Product Manager", "Product Owner", "CTO", "VP of Engineering", 
    "Director of Engineering", "Engineering Manager", "Software Architect", "Senior Backend Developer", "Head of Mobile", "VP of IT Engineering", 
    "Systems Architect", "Head of Internal IT", "Director of Operations", "Senior Database Admin", "Head of DevOps", "COO", "CPO", 
    "VP of BusOps & Analytics", "Head of Data Analytics", "Dir. of Data Analytics", "Head of AI & ML"
]

# List of typical technology used by customers
tech_types = [
    "MongoDB", "Oracle", "Postgres", "Kafka", "AWS", "Ubuntu", "Java", "Elastic Search", "Terraform", "Kubernetes", "Docker", "Azure", "GCP", 
    "C#", ".NET", "Snowflake", "BigQuery", "Tableau", "PowerBI", "Active Directory", "MySQL", "DynamoDB", "DocumentDB", "CosmosDB"
]

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

def generate_challenge():
    """
    Generate a random challenge dictionary.
    """
    return {
        "heading": fake.sentence(),
        "paragraphs": [fake.paragraph() for _ in range(5)]
    }

def generate_solution():
    """
    Generate a random solution dictionary.
    """
    return {
        "heading": fake.sentence(),
        "paragraphs": [fake.paragraph() for _ in range(5)]
    }

def generate_result():
    """
    Generate a random result dictionary.
    """
    return {
        "heading": fake.sentence(),
        "paragraphs": [fake.paragraph() for _ in range(5)]
    }

def generate_quote():
    """
    Generate a random quote dictionary.
    """
    return {
        "person": fake.name(),
        "role": random.choice(role_types),
        "quote": fake.sentence()
    }

def generate_metric():
    """
    Generate a random metric dictionary.
    """
    return {
        "kpi": fake.word(),
        "result": fake.random_int(min=1, max=100),
    }

def get_random_location():
    """
    Get a random city, country, and continent using GeoNamesCache.
    Returns:
        tuple: City, country, and continent.
    """
    # Check if the list of tech cities is not empty
    if not tech_cities:
        return None, None, None
    # Select a random city from the list
    city_name = random.choice(tech_cities)
    city_info_list = gc.get_cities_by_name(city_name)
    # Check if city information is available
    if not city_info_list:
        return None, None, None
    # Get the information of the selected city
    city_info = city_info_list[0]
    city_info_key, city_info_value = next(iter(city_info.items()))
    # Extract country code from city information
    country_code = city_info_value.get('countrycode')
    # Return None if country code is not available
    if not country_code:
        return None, None, None
    # Get country and continent information using country code
    country_info = gc.get_countries()[country_code]
    continent_code = country_info['continentcode']
    continent = gc.get_continents()[continent_code]
    # Return city name, country name, and continent name
    return city_info_value['name'], country_info['name'], continent['name']

# Generate random proof point data
for _ in range(num_proof_points):
    company_products = random.sample(products_list, k=random.randint(3, 6))
    company_services = random.sample(services_list, k=random.randint(1, 2))
    company_value_drivers = random.sample(value_drivers, k=random.randint(1, 3))

    city, country, continent = get_random_location()

    # Generate random company data
    company_data = {
        "company_name": fake.company(),
        "logo": fake.image_url(),
        "website": f"https://www.{fake.company().replace(' ', '').lower()}.com/",
        "size": random.choice([random.randint(1, 100), random.randint(100, 1000), random.randint(1000, 5000),
                               random.randint(5000, 10000), random.randint(10000, 50000)]),
        "about": [fake.paragraph() for _ in range(random.randint(1, 2))],
        "founded": datetime.now().year - random.randint(1, 50),
        "industry": random.choice(industry_types),
        "specialties": [fake.word() for _ in range(random.randint(3, 6))],
        "headquarters": f"{city}, {country}",
        "tech_stack": random.sample(tech_types, k=random.randint(4, 7)),
    }
    # Generate random use case data
    usecase_data = {
        "type": random.choice(usecase_types),
        "title": fake.sentence(),
        "overview": fake.sentence(),
        "introduction": {"heading": fake.sentence(), "paragraphs": [fake.paragraph() for _ in range(5)]},
        "challenges": [generate_challenge() for _ in range(random.randint(1, 3))],
        "solutions": [generate_solution() for _ in range(random.randint(1, 3))],
        "results": [generate_result() for _ in range(random.randint(1, 3))],
        "quotes": [generate_quote() for _ in range(random.randint(1, 3))],
        "metrics": [generate_metric() for _ in range(random.randint(2, 3))]
    }
    # Generate random champion data
    champion_data = {
        "name": random.choice([quote["person"] for quote in usecase_data["quotes"]]),
        "role": random.choice(role_types),
        "responsibilities": fake.sentence()
    }
    # Generate random region data
    region_data = {
        "country": country,
        "city": city,
        "continent": continent
    }

    # Create a random date in the lst 3 years of customer signing and make sure it's not in the last 6 months
    min_days_ago = 30 * 6
    max_days_ago = 365 * 3
    if max_days_ago < min_days_ago:
        max_days_ago = min_days_ago
    date_signed = datetime.now() - timedelta(days=random.randint(min_days_ago, max_days_ago))

    # Generate random account data
    account_data = {
        "products": [product[0] for product in company_products],
        "services": [service[0] for service in company_services],
        "deal_type": random.choice(["Atlas Cloud"] * 9 + ["EA On Premise"]),
        "date_signed": date_signed,
        "owner": fake.name(),
        "sales_motion": random.choices(sales_motions, weights=[weight for sales_motion, weight in sales_motions])[0][0],
        "value_drivers": company_value_drivers,
        "why_do_anything": [fake.paragraph() for _ in range(3)],
        "why_now": [fake.paragraph() for _ in range(3)],
        "why_mongodb": [fake.paragraph() for _ in range(3)],
        "sfdc_acc_link": f"https://mongodb.my.salesforce.com/{fake.uuid4()}",
    }
    # Create a date 6 months after signing for the creation of this proof point.
    date_proof_point_created = date_signed + timedelta(days=180)
    # Generate random proof point data
    proof_point_data = {
        "date_proof_point_created": date_proof_point_created,
        "link_to_deck": f"https://docs.google.com/presentation/d/{fake.uuid4()}/edit?usp=sharing",
        "link_to_web": f"https://www.mongodb.com/customers/{re.sub('[^a-zA-Z0-9]', '-', company_data['company_name']).lower()}",
        "customer_validated": fake.boolean(chance_of_getting_true=90),
    }

    # Concatenate all text to be encoded for use case embedding
    usecase_concatenated_text = ''
    usecase_concatenated_text += 'Industry: ' + company_data["industry"] + '; '
    usecase_concatenated_text += 'Type: ' + usecase_data["type"] + '; Title: ' + usecase_data["title"] + '; Overview:  ' + usecase_data["overview"] + '; '
    usecase_concatenated_text += 'Introduction: ' + usecase_data["introduction"]["heading"] + ' ' + ' '.join(usecase_data["introduction"]["paragraphs"]) + '; '
    # Add challenges to the concatenated text
    for challenge in usecase_data.get("challenges", []):
        usecase_concatenated_text += 'The Challenge: ' + challenge["heading"] + ' ' + ' '.join(challenge["paragraphs"]) + '; '
    # Add solutions to the concatenated text
    for solution in usecase_data.get("solutions", []):
        usecase_concatenated_text += 'The Solution: ' + solution["heading"] + ' ' + ' '.join(solution["paragraphs"]) + ' '
    # Generate embedding for the concatenated text
    embeddings_data = {
        "usecase_embedding": generate_embedding(usecase_concatenated_text)
    }
    # Create the final proof point document
    proof_point = {
        "customer": company_data,
        "usecase": usecase_data,
        "champion": champion_data,
        "region": region_data,
        "account": account_data,
        # "embeddings": embeddings_data,
        **proof_point_data
    }
    # Insert document into MongoDB collection
    collection.insert_one(proof_point)
# Print a message indicating the completion of proof points generation and insertion
print("Proof points generated and inserted into MongoDB collection.")