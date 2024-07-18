# Import necessary libraries
import logging
import time
import requests
from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient, errors
from bson import ObjectId
from config import Config
from openai import OpenAI, OpenAIError

# Initialize the OpenAI client
aiClient = OpenAI()

# Create Flask app
app = Flask(__name__)

# Setup logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Connect to MongoDB
try:
    client = MongoClient(Config.MONGODB_URI)
    db = client[Config.MONGODB_DATABASE]
    collection = db[Config.MONGODB_COLLECTION]
    logger.info("Connected to MongoDB")
except errors.ConnectionError as e:
    logger.error("Could not connect to MongoDB: %s", e)
    raise

# Define the home route
@app.route('/')
def index():
    return render_template('index.html')

# Define the admin route
@app.route('/admin')
def admin():
    return render_template('admin.html')

# Define the route to get products with filters and pagination
@app.route('/products', methods=['GET'])
def get_products():
    try:
        # Get filter and pagination parameters from the request
        search_query = request.args.get('q', '')
        filter_category = request.args.get('category', '')
        filter_sub_category = request.args.get('sub_category', '')
        filter_gender = request.args.get('gender', '')
        filter_brand = request.args.get('brand', '')
        filter_on_sale = request.args.get('on_sale', 'false') == 'true'
        page = int(request.args.get('page', 1))
        limit = 15
        skip = (page - 1) * limit

        must_clauses = []
        should_clauses = []

        # Build search query based on filters
        if search_query:
            must_clauses.append({
                'text': {
                    'query': search_query,
                    'path': ['name', 'description', 'brand', 'sub_category', 'material', 'colors'],
                    "fuzzy": {"maxEdits": 2, "prefixLength": 3}
                }
            })

        if filter_category:
            must_clauses.append({
                'text': {
                    'query': filter_category,
                    'path': 'main_category'
                }
            })

        if filter_sub_category:
            must_clauses.append({
                'text': {
                    'query': filter_sub_category,
                    'path': 'sub_category'
                }
            })

        if filter_gender:
            must_clauses.append({
                'text': {
                    'query': filter_gender,
                    'path': 'gender'
                }
            })

        if filter_brand:
            must_clauses.append({
                'text': {
                    'query': filter_brand,
                    'path': 'brand'
                }
            })

        if filter_on_sale:
            must_clauses.append({
                'equals': {
                    'value': True,
                    'path': 'on_sale'
                }
            })

        if search_query or filter_category or filter_sub_category or filter_gender or filter_brand or filter_on_sale:
            should_clauses.append({
                "equals": {
                    "value": True,
                    "path": "sponsored",
                    "score": {"boost": {"value": 3}}
                }
            })

        search_stage = {
            '$search': {
                'index': 'default',
                'compound': {
                    'must': must_clauses,
                    'should': should_clauses
                }
            }
        }

        match_stage = {
            '$match': {'created_manually': True}
        }

        pipeline = [search_stage if must_clauses or should_clauses else match_stage]

        pipeline.extend([
            {'$sort': {'sponsored': -1}},
            {'$skip': skip},
            {'$limit': limit},
            {'$project': {
                'name': 1,
                'price': 1,
                'description': 1,
                'brand': 1,
                'main_category': 1,
                'sub_category': 1,
                'images': 1,
                'sponsored': 1,
                'on_sale': 1,
                'created_manually': 1,
                'score': {'$meta': 'searchScore'}
            }}
        ])

        results = collection.aggregate(pipeline)
        products = list(results)

        # Calculate total products count for pagination
        count_pipeline = [search_stage, {'$count': 'total'}] if (must_clauses or should_clauses) else [{'$match': {'created_manually': True}}, {'$count': 'total'}]
        total_result = list(collection.aggregate(count_pipeline))

        total_products = total_result[0]['total'] if total_result else 0

        for product in products:
            product['_id'] = str(product['_id'])

        total_pages = (total_products + limit - 1) // limit

        return jsonify({
            'products': products,
            'total_pages': total_pages,
            'current_page': page,
            'total_products': total_products
        })
    except Exception as e:
        logger.error("Error fetching products: %s", e)
        return jsonify({'error': str(e)}), 500

# Define the route to get a single product by ID
@app.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = collection.find_one({'_id': ObjectId(product_id)})
        if product:
            product['_id'] = str(product['_id'])
            return jsonify(product)
        else:
            return jsonify({'error': 'Product not found'}), 404
    except Exception as e:
        logger.error("Error fetching product: %s", e)
        return jsonify({'error': str(e)}), 500

# Define the route to add a new product
@app.route('/products', methods=['POST'])
def add_product():
    try:
        data = request.json
        data['created_manually'] = True
        result = collection.insert_one(data)
        return jsonify({'message': 'Product added', 'id': str(result.inserted_id)}), 201
    except Exception as e:
        logger.error("Error adding product: %s", e)
        return jsonify({'error': str(e)}), 500

# Define the route to update an existing product by ID
@app.route('/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        data = request.json
        result = collection.update_one({'_id': ObjectId(product_id)}, {'$set': data})
        if result.matched_count:
            return jsonify({'message': 'Product updated'})
        else:
            return jsonify({'error': 'Product not found'}), 404
    except Exception as e:
        logger.error("Error updating product: %s", e)
        return jsonify({'error': str(e)}), 500

# Define the route to delete a product by ID
@app.route('/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        result = collection.delete_one({'_id': ObjectId(product_id)})
        if result.deleted_count:
            return jsonify({'message': 'Product deleted'})
        else:
            return jsonify({'error': 'Product not found'}), 404
    except Exception as e:
        logger.error("Error deleting product: %s", e)
        return jsonify({'error': str(e)}), 500

# Define the route to delete multiple products based on a filter
@app.route('/products', methods=['DELETE'])
def delete_products():
    try:
        filter_query = request.json.get('filter', {})
        result = collection.delete_many(filter_query)
        return jsonify({'message': f'{result.deleted_count} products deleted'})
    except Exception as e:
        logger.error("Error deleting products: %s", e)
        return jsonify({'error': str(e)}), 500

# Define the route to get product recommendations based on embeddings
@app.route('/products/<product_id>/recommendations', methods=['GET'])
def get_recommendations(product_id):
    try:
        product = collection.find_one({'_id': ObjectId(product_id)}, {'embeddings': 1})
        if not product or 'embeddings' not in product:
            return jsonify({'error': 'Product not found or missing embeddings'}), 404

        embeddings = product['embeddings']

        search_stage = {
            "$vectorSearch": {
                "index": "vs_details",
                "queryVector": embeddings,
                "path": "embeddings",
                "numCandidates": 50,
                "limit": 10,
            }
        }

        pipeline = [
            search_stage,
            {'$match': {'_id': {'$ne': ObjectId(product_id)}}},
            {'$project': {
                'name': 1,
                'price': 1,
                'description': 1,
                'brand': 1,
                'main_category': 1,
                'sub_category': 1,
                'images': 1,
                'sponsored': 1,
                'on_sale': 1,
                'created_manually': 1,
                'score': {'$meta': 'searchScore'}
            }}
        ]

        results = collection.aggregate(pipeline)
        recommendations = list(results)

        for recommendation in recommendations:
            recommendation['_id'] = str(recommendation['_id'])

        return jsonify(recommendations)
    except Exception as e:
        logger.error("Error fetching recommendations: %s", e)
        return jsonify({'error': str(e)}), 500

# Define the route for autocomplete search suggestions
@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    try:
        search_query = request.args.get('q', '')
        if not search_query:
            return jsonify([])

        pipeline = [
            {
                '$search': {
                    'index': 'default-ac',
                    'autocomplete': {
                        'query': search_query,
                        'path': 'name',
                        'fuzzy': {'maxEdits': 1}
                    }
                }
            },
            {'$limit': 5},
            {'$project': {
                '_id': 1,
                'name': 1
            }}
        ]

        results = collection.aggregate(pipeline)
        suggestions = [{'id': str(result['_id']), 'name': result['name']} for result in results]
        return jsonify(suggestions)
    except Exception as e:
        logger.error("Error fetching autocomplete suggestions: %s", e)
        return jsonify({'error': str(e)}), 500

# Function to generate embeddings for text using OpenAI
def generate_embedding(text, model="text-embedding-3-large"):
    try:
        return aiClient.embeddings.create(input=[text], model=model).data[0].embedding
    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        raise

# Define the route for the FashionBot
@app.route('/fashionbot', methods=['POST'])
def fashionbot():
    try:
        data = request.json
        logger.debug(f"Received request data: {data}")

        product_id = data.get('product_id')
        question = data.get('question')

        if not product_id or not question:
            logger.error("Product ID and question are required")
            return jsonify({'error': 'Product ID and question are required'}), 400

        product = collection.find_one({'_id': ObjectId(product_id)}, {'embeddings': 1, 'images': 1})
        if not product or 'embeddings' not in product or 'images' not in product:
            logger.error("Product not found or missing embeddings/images")
            return jsonify({'error': 'Product not found or missing embeddings or images'}), 404

        image_url = product['images'][0]  # Assuming there's at least one image

        # Create conversation context for FashionBot
        conversation = [
            {"role": "system", "content": "You are a helpful fashion assistant from the Zalando retail store."},
            {"role": "assistant", "content": "Include this text at the end of the message: I have listed some recommendations below for their consideration based on the image and what they asked for."},
            {"role": "user", "content": [
                {"type": "text", "text": question},
                {"type": "image_url", "image_url": {"url": image_url}}
            ]},
        ]

        # Get response from OpenAI's chat completion
        completion = aiClient.chat.completions.create(
            model="gpt-4o",
            messages=conversation,
        )
        answer_content = completion.choices[0].message.content

        # Generate an embedding for the combined input
        combined_input = f"Question: {question}\nAnswer: {answer_content}"
        question_embedding = generate_embedding(combined_input)

        # Find matching products using MongoDB Atlas Vector Search
        search_stage = {
            "$vectorSearch": {
                "index": "vs_details",
                "queryVector": question_embedding,
                "path": "embeddings",
                "numCandidates": 50,
                "limit": 7,
            }
        }

        pipeline = [
            search_stage,
            {'$match': {'_id': {'$ne': ObjectId(product_id)}}},
            {'$project': {
                'name': 1,
                'price': 1,
                'description': 1,
                'brand': 1,
                'main_category': 1,
                'sub_category': 1,
                'images': 1,
                'sponsored': 1,
                'on_sale': 1,
                'created_manually': 1,
                'score': {'$meta': 'searchScore'}
            }}
        ]

        results = collection.aggregate(pipeline)
        recommendations = list(results)

        for recommendation in recommendations:
            recommendation['_id'] = str(recommendation['_id'])

        return jsonify({'answer': answer_content, 'recommendations': recommendations})
    except Exception as e:
        logger.error(f"General Error: {e}")
        return jsonify({'error': 'An unexpected error occurred. Please try again later.'}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
