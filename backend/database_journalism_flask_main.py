from flask import *
from sqlalchemy import *
from sqlalchemy.sql import text
from functions import *
from enums import *
from database import connection

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return "goodbye"

@app.route('/add', methods=['GET'])
def add_student():
    connection.execute(text(f'SELECT * FROM student'))
    return jsonify({'name': 'gay'})

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    app.run(debug=True)

connection.close()