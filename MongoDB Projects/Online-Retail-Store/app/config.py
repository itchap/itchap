# config.py
import os

class Config:
    # MongoDB connection details
    MONGODB_URI = "mongodb+srv://itchap:NokiaN900@democluster.0wrhw.mongodb.net/?retryWrites=true&w=majority&appName=DemoCluster"
    MONGODB_DATABASE = "retail_store"
    MONGODB_COLLECTION = "products"

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# # config.py
# import os

# class Config:
#     # MongoDB connection details
#     MONGODB_URI = os.getenv("MONGODB_URI")
#     MONGODB_DATABASE = "retail_store"
#     MONGODB_COLLECTION = "products"
#     OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
