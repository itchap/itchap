import json
import re
from bs4 import BeautifulSoup

def clean_text(text):
    # Remove newline characters and extra spaces between words
    cleaned_text = re.sub(r'\n|\s+', ' ', text.strip())
    # Replace any remaining double spaces with a single space
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
    return cleaned_text

def extract_customer_info(div):
    # Find the <a> tag with 'href' attribute within the current div
    link = div.find('a', href=True)
    customer_story_url = link.get('href') if link else None

    # Find the logo URL inside the child div with class 'relative'
    relative_div = div.find('div', class_='relative')
    customer_logo_url = relative_div.find('img')['src'] if relative_div and relative_div.find('img') else None

    # Find the customer story overview inside the child div with class 'fnt-18 dark-gray m-b-20'
    overview_span = div.find('div', class_='fnt-18 dark-gray m-b-20').find('span')
    customer_story_overview = clean_text(overview_span.get_text(strip=True)) if overview_span else None

    # Create a dictionary with the extracted information
    customer_info = {
        "customer_story_url": customer_story_url,
        "customer_logo_url": customer_logo_url,
        "customer_story_overview": customer_story_overview
    }

    return customer_info

def print_customer_info(file_path):
    customer_info_array = []

    try:
        # Read the HTML content from the local file
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Parse the HTML content of the page
        soup = BeautifulSoup(content, 'html.parser')

        # Find all div tags with the specified class
        target_divs = soup.find_all('div', class_='who-uses-mongodb__CustomerContainer-sc-1047abz-1 jERciZ')

        # Iterate through the divs and extract customer information
        for div in target_divs:
            customer_info = extract_customer_info(div)
            customer_info_array.append(customer_info)

        # Print the array of objects
        print(json.dumps(customer_info_array, indent=2))

    except FileNotFoundError:
        print(f"File not found: {file_path}")

# Path to the local HTML file
html_file_path = "test.html"

# Call the function with the specified file path
print_customer_info(html_file_path)
