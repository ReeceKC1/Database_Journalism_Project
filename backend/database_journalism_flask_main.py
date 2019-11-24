from flask import *
from sqlalchemy import *
from sqlalchemy.sql import text
from functions import *
from enums import *
from database import *
from flask_cors import CORS
import uuid 

app = Flask(__name__)

CORS(app)

@app.route('/')
def home():
    return "Hello world!"

@app.route('/api/student/check.<string:id>', methods=['GET'])
def check_student(id):
    session = Session()
    student = session.query(Student).filter_by(student_id=id).one_or_none()
    if student:
        return jsonify({'success': 'student found'}), 200
    return jsonify({'error': 'student not found'}), 400

@app.route('/api/supervisor/check.<string:email>', methods=['GET'])
def supervisor_check(email):
    session = Session()
    supervisor = session.query(Supervisor).filter_by(email=email).one_or_none()
    if supervisor:
        return jsonify({'success': 'supervisor found'}), 200
    return jsonify({'error': 'supervisor not found'}), 400

@app.route('/api/company/check.<string:name>', methods=['GET'])
def company_check(name):
    session = Session()
    company = session.query(Company).filter_by(company_name=name).one_or_none()
    if company:
        return jsonify({'success': 'company found'}), 200
    return jsonify({'error': 'company not found'}), 400

############################################################
# Evaluation api
############################################################
@app.route('/api/evaluation/create', methods=['POST'])
def create_evaluation():
    session = Session()
    try:
        questions = request.json.pop('questions')
        print(request.json)
        evaluation = Evaluation(**request.json)
        session.add(evaluation)
        session.commit()

        
        # Iterating through each question
        for question in questions:
            # print(question)
            question.pop('id')
            question['question_id'] = str(uuid.uuid1())
            question['evaluation_year'] = evaluation.year
            question['evaluation_type'] = evaluation.eval_type
            options = question.pop('options')
            print(question)
            question_obj = Question(**question)
            session.add(question_obj)
            session.commit()

            # Iterating through each option
            for option in options:
                option['option_weight'] = str(option.pop('id'))
                option['question_id'] = question_obj.question_id
                # print(option)
                option_obj = Option(**option)
                session.add(option_obj)
                session.commit()

        # Saving the objects to the DB
        # session.commit()
    except Exception as e:
        print(e)
        return jsonify({'error': 'could not save'}), 400

    return jsonify({'status': 'saved'}), 200

@app.route('/api/evaluation/get', methods=['GET'])
def get_evaluation():
    session = Session()
    param_type = request.args.get('type')
    param_year = request.args.get('year')

    # Get an Evaluation based on type and year
    if param_type != None and param_year != None:
        return get_evaluation_by_key(param_type, param_year)

    q = session.query(Evaluation).all();
    return jsonify(result=[i.seralize for i in q]), 200

@app.route('/api/answer/evaluation', methods=['POST'])
def create_answer():
    return

@app.route('/api/destroy_all')
def destroy_all():
    destroy_database()
    return jsonify({'success': 'destroyed database'}), 200

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    app.run(debug=True)

connection.close()