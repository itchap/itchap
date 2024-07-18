# import time
import logging
import time
import requests
from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient, errors
from bson import ObjectId
from config import Config

from openai import OpenAI, OpenAIError, RateLimitError
aiClient = OpenAI()

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

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/products', methods=['GET'])
def get_products():
    try:
        search_query = request.args.get('q', '')
        filter_category = request.args.get('category', '')
        filter_gender = request.args.get('gender', '')
        filter_brand = request.args.get('brand', '')
        filter_on_sale = request.args.get('on_sale', 'false') == 'true'
        page = int(request.args.get('page', 1))
        limit = 12
        skip = (page - 1) * limit

        must_clauses = []
        should_clauses = []

        if search_query:
            must_clauses.append({
                'text': {
                    'query': search_query,
                    'path': ['name', 'description', 'brand', 'sub_category', 'material', 'colors'],
                    "fuzzy": { "maxEdits": 2, "prefixLength": 3 }
                }
            })

        if filter_category:
            must_clauses.append({
                'text': {
                    'query': filter_category,
                    'path': 'main_category'
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

        if search_query or filter_category or filter_gender or filter_brand or filter_on_sale:
            should_clauses.append({
                "equals": {
                    "value": True,
                    "path": "sponsored",
                    "score": { "boost": { "value": 3 } }
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
            '$match': {'created_manually':True}
        }

        pipeline = []
        if must_clauses or should_clauses:
            pipeline.append(search_stage)
        else:
            pipeline.append(match_stage)  

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

        # Ensure total_products calculation is consistent
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

@app.route('/products', methods=['DELETE'])
def delete_products():
    try:
        filter_query = request.json.get('filter', {})
        result = collection.delete_many(filter_query)
        return jsonify({'message': f'{result.deleted_count} products deleted'})
    except Exception as e:
        logger.error("Error deleting products: %s", e)
        return jsonify({'error': str(e)}), 500

@app.route('/products/<product_id>/recommendations', methods=['GET'])
def get_recommendations(product_id):
    try:
        product = collection.find_one({'_id': ObjectId(product_id)}, {'embeddings': 1})
        if not product or 'embeddings' not in product:
            return jsonify({'error': 'Product not found or missing embeddings'}), 404

        embeddings = product['embeddings']

        # Ensure `embeddings` is in the correct format for MongoDB Atlas Vector Search
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
            {'$match': {'_id': {'$ne': ObjectId(product_id)}}},  # Exclude the current product
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

def generate_embedding(text, model="text-embedding-3-large"):
   try:
     return aiClient.embeddings.create(input = [text], model=model).data[0].embedding
   except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        raise

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

        try:
            product = collection.find_one({'_id': ObjectId(product_id)}, {'embeddings': 1, 'images': 1})
        except Exception as e:
            logger.error(f"Error fetching product from MongoDB: {e}")
            return jsonify({'error': 'Product not found or database error'}), 500

        if not product or 'embeddings' not in product or 'images' not in product:
            logger.error("Product not found or missing embeddings/images")
            return jsonify({'error': 'Product not found or missing embeddings or images'}), 404

        image_url = product['images'][0]  # Assuming there's at least one image

        # # Combine the question and image URL to create a context string
        # combined_input = f"Image URL: {image_url}\nQuestion: {question}"

        # # Generate an embedding for the combined input using OpenAI's API
        # question_embedding = generate_embedding(combined_input)

        # # Use MongoDB Atlas Vector Search to find matching products
        # search_stage = {
        #     "$vectorSearch": {
        #         "index": "vs_details",
        #         "queryVector": question_embedding,
        #         "path": "embeddings",
        #         "numCandidates": 50,
        #         "limit": 10,
        #     }
        # }

        # pipeline = [
        #     search_stage,
        #     {'$match': {'_id': {'$ne': ObjectId(product_id)}}},  # Exclude the current product
        #     {'$project': {
        #         'name': 1,
        #         'price': 1,
        #         'description': 1,
        #         'brand': 1,
        #         'main_category': 1,
        #         'sub_category': 1,
        #         'images': 1,
        #         'sponsored': 1,
        #         'on_sale': 1,
        #         'created_manually': 1,
        #         'score': {'$meta': 'searchScore'}
        #     }}
        # ]

        # results = collection.aggregate(pipeline)
        # recommendations = list(results)

        # for recommendation in recommendations:
        #     recommendation['_id'] = str(recommendation['_id'])

        conversation = [
            {"role": "system", "content": "You are a helpful fashion assistant from the Zalando retail store."},
            {"role": "assistant", "content": "Include this text at the end of the message: I have listed some recomendations below for their consideration based on the image and what they asked for."},
            {"role": "user", "content": [
                {"type": "text", "text": question},
                {
                    "type": "image_url",
                    "image_url": {"url": image_url}
                }
            ]},
        ]

        try:
            completion = aiClient.chat.completions.create(
                model="gpt-4o",
                messages=conversation,
                # temperature=temp,
                # max_tokens=tokens
            )
            # Extract the generated answer from the response
            answer = completion.choices[0].message
            answer_content = answer.content

        except OpenAIError as e:
            print(f"OpenAI Error: {e}")
            return "An error occurred."
            
        # Combine the original question and the ChatGPT answer
        combined_input = f"Question: {question}\nAnswer: {answer_content}"

        # Generate an embedding for the combined input using OpenAI's API
        question_embedding = generate_embedding(combined_input)

        # Use MongoDB Atlas Vector Search to find matching products
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
            {'$match': {'_id': {'$ne': ObjectId(product_id)}}},  # Exclude the current product
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

    

if __name__ == '__main__':
    app.run(debug=True)