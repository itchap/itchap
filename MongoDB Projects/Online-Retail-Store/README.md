# Online Retail Store

This project is an online retail store demo application showcasing the use of MongoDB, Atlas Search, Atlas Vector Search, and a RAG (Retrieve and Generate) feature for a Fashion Chatbot. The application is built using Flask, with a MongoDB backend and OpenAI for conversational AI.

## Project Structure
```bash
Online-Retail-Store/
|---- ecomm-web-app/
|    |---- static/
|    |    |---- css/
|    |    |    |---- styles.cs
|    |    |---- images/
|    |    |---- js/
|    |    |    |---- fashionbot.js
|    |    |    |---- main.js
|    |    |    |---- products.js
|    |---- templates/
|    |    |---- admin.html
|    |    |---- index.html
|    |---- app.py
|    |---- config.py
|    |---- logging_setup.py
|    |---- products.py
|    |---- requirements.txt
|    |---- user.py
```
## Setup Instructions

### Prerequisites

1. Python 3.8+
2. MongoDB
3. OpenAI API Key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/online-retail-store.git
cd online-retail-store/ecomm-web-app
```
2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate   # On Windows use `venv\Scripts\activate`
```
3.	Install the required dependencies:
```bash
pip install -r requirements.txt
```
4.	Set up your environment variables:
Create a .env file in the ecomm-web-app directory with the following content:
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/test?retryWrites=true&w=majority
OPENAI_API_KEY=your_openai_api_key
```
5.	Run the application:
```bash
    python app.py
```
6.	Access the application at http://127.0.0.1:5000/.


## Project Components

### Backend

	•	app.py: Main Flask application file. Sets up the Flask app, registers blueprints, and defines error handling.
	•	config.py: Configuration file for environment variables.
	•	logging_setup.py: Sets up structured logging using structlog.
	•	products.py: Contains API endpoints for managing products (CRUD operations and search functionality).
	•	user.py: Contains API endpoints for user interactions, including the Fashion Chatbot and autocomplete functionality.
	•	search-index-mappings.json: Configuration for search index mappings.
	•	vector_search_index.json: Configuration for vector search index.

### Frontend

	•	templates/: Contains HTML templates for the application.
	•	index.html: Main page template.
	•	admin.html: Admin page template.
	•	static/: Contains static files (CSS, images, JavaScript).
	•	css/: Custom stylesheets.
	•	images/: Placeholder for images.
	•	js/: JavaScript files for frontend logic.
	•	fashionbot.js: Logic for interacting with the Fashion Chatbot.
	•	main.js: Main frontend logic, including event listeners and filter handling.
	•	products.js: Logic for loading and rendering products.

### Features

	•	Product Management: CRUD operations for managing products in the MongoDB database.
	•	Search and Filtering: Advanced search and filtering capabilities using MongoDB Atlas Search.
	•	Fashion Chatbot: Interactive chatbot providing product recommendations based on user queries and product information.
	•	Autocomplete: Real-time search suggestions for product names.

### Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.


### Contact

For any questions or suggestions, please contact peter.smith@mongodb.com