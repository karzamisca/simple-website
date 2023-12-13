from flask import Flask, jsonify, request
import pymongo
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Establish MongoDB connection
client = pymongo.MongoClient('mongodb+srv://MinhQuan:vigjcqq7@shop.90ydj5q.mongodb.net/?retryWrites=true&w=majority')
db = client['shop']
coffee_collection = db['coffee']
cred_collection = db['credential']
collection = db['purchases']

# Define a route to retrieve coffee data
@app.route('/data/coffee-data', methods=['GET'])
def get_coffee_data():
    cursor = coffee_collection.find({}, {'_id': 0})  # Exclude _id field
    coffee_data = list(cursor)
    return jsonify(coffee_data)

# Define a route to retrieve coffee data
@app.route('/data/cred-data', methods=['GET'])
def get_cred_data():
    cursor = cred_collection.find({}, {'_id': 0})  # Exclude _id field
    cred_data = list(cursor)
    return jsonify(cred_data)

if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask app
