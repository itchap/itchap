import re
import time
import requests
import json
from bs4 import BeautifulSoup
from openai import OpenAI, OpenAIError, RateLimitError
from datetime import datetime, timedelta
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from config import Config

# Use configuration constants
uri = Config.MONGODB_URI
db_name = Config.MONGODB_DATABASE
coll_name = Config.MONGODB_COLLECTION

# Create a new MongoDB client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client[db_name]
collection = db[coll_name]

# Initialize OpenAI client
client = OpenAI()

def get_embedding(text, model="text-embedding-3-small"):
   text = text.replace("\n", " ")
   return client.embeddings.create(input = [text], model=model).data[0].embedding

def clean_text(text):
    cleaned_text = re.sub(r'\n|\s+', ' ', text.strip())
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
    return cleaned_text

def extract_customer_info(div):
    link = div.find('a', href=True)
    customer_story_url = link.get('href') if link else None

    relative_div = div.find('div', class_='relative')
    customer_logo_url = relative_div.find('img')['src'] if relative_div and relative_div.find('img') else None

    overview_span = div.find('div', class_='fnt-18 dark-gray m-b-20').find('span')
    customer_story_overview = clean_text(overview_span.get_text(strip=True)) if overview_span else None

    customer_info = {
        "customer_story_url": customer_story_url,
        "customer_logo_url": customer_logo_url,
        "customer_story_overview": customer_story_overview
    }

    return customer_info

def get_customer_stories(file_path):
    customer_info_array = []

    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        soup = BeautifulSoup(content, 'html.parser')

        target_divs = soup.find_all('div', class_='who-uses-mongodb__CustomerContainer-sc-1047abz-1 jERciZ')

        for div in target_divs:
            customer_info = extract_customer_info(div)
            customer_info_array.append(customer_info)

        return customer_info_array

    except FileNotFoundError:
        print(f"File not found: {file_path}")

def make_rag_request(customer_story_html, desired_schema, retry_count=0):
    conversation = [
        {"role": "system", "content": "You are a sales and marketing expert, skilled in building customer success stories. You will take html data from a user about a customer success story, then extract and use all the data to create a data rich json document aligned to the data model provided. Please make the 'challenges', 'solutions' and 'results' paragraph arrays detailed. Please only return the json document without code tag wrappers and no other comments or statements"},
        {"role": "assistant", "content": "This is the data model: " + desired_schema},
        {"role": "user", "content": "This is the html data:" + customer_story_html}
    ]

    try:
        completion = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=conversation
        )
        answer = completion.choices[0].message
        return answer

    except RateLimitError as rle:
        retry_count += 1
        delay = 2 ** retry_count
        print(f"Rate Limit Exceeded. Retrying in {delay} seconds...")
        time.sleep(delay)
        return make_rag_request(customer_story_html, desired_schema, retry_count)

    except OpenAIError as e:
        print(f"OpenAI Error: {e}")
        return "An error occurred."

def get_html_content(url, allowed_tags=None):
    # Check if 'https://www.mongodb.com' is missing and append it
    if not url.startswith('https://www.mongodb.com'):
        url = 'https://www.mongodb.com' + url

    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        # Remove <img>, <svg>, and <style> tags and their inner content
        for tag in soup.find_all(['img', 'svg', 'style']):
            tag.decompose()

        # Remove <span> tags with empty inner content
        for span in soup.find_all('span'):
            if not span.get_text(strip=True):
                span.decompose()

        if allowed_tags:
            allowed_tags = set(allowed_tags)
            text_content = ""
            for tag in soup.find_all():
                if tag.name in allowed_tags:
                    text_content += str(tag) + ' '

            return text_content.strip()
        else:
            return response.text.strip()
    else:
        raise Exception(f"Failed to fetch HTML content from {url}")\


def main():
    html_file_path = "test.html" # A web page with a list of customer story page urls with overviews and links to the logo image
    customer_info_array = get_customer_stories(html_file_path)

    desired_schema = '''
    {'customer': {'company_name': string, 'logo_url': string, 'website_url': string, 'size': integer, 'about': array of string sentences, 'founded': integer, 'industry': string, 'specialties': array of strings, 'headquarters': string, 'tech_stack': array of string sentences},
    'usecase': {'type': string, 'title': string, 'overview': string, 'introduction': {'heading': string, 'paragraphs': array of string sentences},
    'challenges': [{'heading': string, 'paragraphs': array of string sentences}],
    'solutions': [{'heading': string, 'paragraphs': array of string sentences}, {'heading': string, 'paragraphs': array of string sentences}],
    'results': [{'heading': string, 'paragraphs': array of string sentences}],
    'quotes': [{'person': string, 'role': string, 'company': string, 'quote': string}, {'person': string, 'role': string, 'company': string, 'quote': string}],
    'metrics': [{'kpi': string, 'result': string}, {'kpi': string, 'result': string}, {'kpi': string, 'result': string}, {'kpi': string, 'result': string}]},
    'champion': {'name': string, 'role': string, 'responsibilities': string},
    'region': {'country': string, 'city': string, 'continent': string},
    'account': {'mongodb_products': array of string sentences, 'mongodb_services': array of string sentences, 'deal_type': string, 'date_signed': ISODate, 'acc_owner': string,
    'sales_motion': string, 'value_drivers': array of string sentences, 'why_do_anything': array of string sentences, 'why_now': array of string sentences, 'why_mongodb': array of string sentences, 'sfdc_acc_link': string},
    'date_proof_point_created': ISODate, 'link_to_deck': string, 'link_to_web': string, 'customer_validated': boolean}
    '''

    for customer_info in customer_info_array:
        customer_story_url = customer_info.get("customer_story_url")
        customer_logo_url = customer_info.get("customer_logo_url")
        customer_story_overview = customer_info.get("customer_story_overview")

        # Specify the allowed tags
        allowed_tags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'em', 'span', 'blockquote', 'cite']

        # Fetch HTML content including customer_logo_url and customer_story_overview
        customer_story_html = get_html_content(customer_story_url, allowed_tags)
        customer_story_html += f"<p>customer_logo_url='{customer_logo_url}' and customer_story_overview='{customer_story_overview}'</p>"

        # Make RAG request
        answer_object = make_rag_request(customer_story_html, desired_schema)
        proof_point_data = answer_object.content
        result_embeddings = get_embedding(proof_point_data)

        # Parse the JSON-formatted string into a dictionary
        proof_point_data_dict = json.loads(proof_point_data)

        proof_point = {
            **proof_point_data_dict,
            "embeddings": result_embeddings
        }
        
        # Insert document into MongoDB collection
        collection.insert_one(proof_point)

        print(f"Customer Story URL: {customer_story_url}")
        print("-" * 100)

if __name__ == "__main__":
    main()

