from flask import *
from sqlalchemy import *
from sqlalchemy.sql import text
from functions import *
from enums import *
from database import *
from flask_cors import CORS
import uuid 
import traceback
import re

app = Flask(__name__)

CORS(app)

############################################################
# Object api                                               #
############################################################
# EDIT: Chase 12/6/2019
# Made function accept both name and student id
@app.route('/api/student/check/<id>', methods=['GET'])
def check_student(id):
    session = Session()
    student = session.query(Student).filter_by(student_id=id).all()

    if len(student) == 0:
        # Split Name
        name = re.split("\s", id)

        # If only first name is present
        if len(name) == 1:
            # Do first name first
            student = session.query(Student).filter(
                Student.first_name.like(name[0] + "%")
                ).all()

            if len(student) == 0:
                # Do first name first
                student = session.query(Student).filter(
                    Student.last_name.like(name[0] + "%")
                    ).all()

        elif len(name) == 2:
             student = session.query(Student).filter(
                Student.first_name.like(name[0] + "%"),
                Student.last_name.like(name[1] + "%")
                ).all()

    session.close()

    # Returning data
    if student:
        # return jsonify(student.seralize), 200
        return jsonify([i.seralize for i in student]), 200
    return jsonify({'error': 'student not found'}), 400

@app.route('/api/supervisor/check/<email>', methods=['GET'])
def supervisor_check(email):
    session = Session()
    supervisor = session.query(Supervisor).filter_by(email=email).one_or_none()

    session.close()
    if supervisor:
        return jsonify(supervisor.seralize), 200
    return jsonify({'error': 'supervisor not found'}), 400

@app.route('/api/company/check/<name>', methods=['GET'])
def company_check(name):
    session = Session()
    company = session.query(Company).filter_by(company_name=name).one_or_none()

    session.close()
    if company:
        return jsonify(company.seralize), 200
    return jsonify({'error': 'company not found'}), 400

@app.route('/api/internship', methods=['GET'])
def get_internship():
    session = Session()
    student_id = request.args.get('student_id')
    company_name = request.args.get('company_name')
    start_date = request.args.get('start_date')
    internship = session.query(Internship).filter_by(student_id=student_id,company_name=company_name,start_date=start_date).one_or_none()
    
    session.close()
    if internship:
        return jsonify(internship.seralize), 200
    return jsonify({'error': 'internship not found'}), 400

############################################################
# Evaluation api                                           #
############################################################
@app.route('/api/evaluation/create', methods=['POST'])
def create_evaluation():
    session = Session()
    try:
        questions = request.json.pop('questions')
        evaluation = Evaluation(**request.json)
        session.add(evaluation)
        session.commit()

        # Iterating through each question
        for question in questions:
            # Label duplicate checking
            if len([q for q in questions if q['label'] == question['label']]) > 1:
                print('error duplicate labels')
                return jsonify({'error': 'error duplicate labels'}), 400
            question['order_value'] = question.pop('id')
            question['question_id'] = str(uuid.uuid1())
            question['evaluation_year'] = evaluation.year
            question['evaluation_type'] = evaluation.eval_type
            options = question.pop('options')
            question_obj = Question(**question)
            session.add(question_obj)
            session.commit()

            # Iterating through each option
            for option in options:
                option['option_weight'] = str(option.pop('id'))
                option['question_id'] = question_obj.question_id
                option_obj = Option(**option)
                session.add(option_obj)

        # Saving the objects to the DB
        session.commit()
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400
    finally:
        session.close()

    return jsonify({'status': 'saved'}), 200

@app.route('/api/evaluation/get', methods=['GET'])
def get_evaluation():
    session = Session()
    try:
        param_type = request.args.get('type')
        param_year = request.args.get('year')
        start_year = request.args.get('start_year')
        end_year = request.args.get('end_year')

        if param_type and start_year and end_year:
            return get_evaluation_by_type_start_end(param_type, start_year, end_year, session)

        # Get an Evaluation based on type and year
        if param_type and param_year:
            return get_evaluation_by_key(param_type, param_year, session)

        if start_year and end_year:
            return get_evaluation_by_start_end(start_year, end_year, session)

        if param_year:
            return get_evaluation_by_year(param_year, session)

        if param_type:
            return get_evaluation_by_type(param_type, session)

        q = session.query(Evaluation).order_by(Evaluation.year.desc())
        return jsonify([i.seralize for i in q]), 200
    except Exception as e:
        print(e)
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 400
    finally:
        session.close()

############################################################
# Answer api                                               #
############################################################
@app.route('/api/answer/evaluation', methods=['POST'])
def create_answer():
    session = Session()
    try:
        evaluation = request.json

        if not session.query(Evaluation).filter_by(year=evaluation['eval_year'],eval_type=evaluation['eval_type']).one_or_none():
            print("no evaluation")
            return jsonify({'error': 'no evaluation'}), 400

        student = evaluation.pop('student')
        student_obj = Student(**student)
        if not session.query(Student).filter_by(student_id=student_obj.student_id).one_or_none():
            session.add(student_obj)
            session.commit()

        answers = evaluation.pop('answers')
        evaluation['student_id'] = student['student_id']
        evaluation['answer_id'] = str(uuid.uuid1())

        if evaluation['eval_type'] == 'portfolio_eval':
            evaluation['date_reviewed'] = func.current_date()
            evaluation_obj = Portfolio_Answers(**evaluation)
            session.add(evaluation_obj)
            session.commit()
            for obj in answers:
                comment_text = obj.pop('comment_text')
                comment = {
                    'comment_text': comment_text,
                    'comment_id': str(uuid.uuid1())
                }
                comment_obj = Comment(**comment)
                session.add(comment_obj)
                session.commit()
                obj['comment_id'] = comment['comment_id']
                obj['answer_id'] = evaluation['answer_id']
                answer_obj = Port_Answer(**obj)
                session.add(answer_obj)
            session.commit()
        else:
            company = evaluation.pop('company')
            company_obj = Company(**company)
            if not session.query(Company).filter_by(company_name=company_obj.company_name).one_or_none():
                session.add(company_obj)

            supervisor = evaluation.pop('supervisor')
            supervisor['company_name'] = company_obj.company_name
            supervisor_obj = Supervisor(**supervisor)
            if not session.query(Supervisor).filter_by(email=supervisor_obj.email).one_or_none():
                session.add(supervisor_obj)
            session.commit()

            internship = evaluation.pop('internship')
            internship['student_id'] = student['student_id']
            internship['company_name'] = company['company_name']
            internship['supervisor_email'] = supervisor['email']
            internship_obj = Internship(**internship)
            if not session.query(Internship).filter_by(student_id=internship_obj.student_id,company_name=internship_obj.company_name,start_date=internship_obj.start_date).one_or_none():
                session.add(internship_obj)
            session.commit()

            evaluation['company_name'] = company['company_name']
            evaluation['supervisor_email'] = supervisor['email']

            comment_text = evaluation.pop('comment_text')
            comment = {
                'comment_text': str(comment_text),
                'comment_id': str(uuid.uuid1())
            }
            comment_obj = Comment(**comment)
            session.add(comment_obj)
            session.commit()

            evaluation['comment_id'] = comment['comment_id']
            evaluation_obj = Evaluation_Answers(**evaluation)
            session.add(evaluation_obj)
            session.commit()

            for obj in answers:
                obj['answer_id'] = evaluation['answer_id']
                answer_obj = Eval_Answer(**obj)
                session.add(answer_obj)
            session.commit()
    except Exception as e:
        print(e)
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 400
    finally:
        session.close()

    return jsonify({'status': 'saved'}), 200

@app.route('/api/answer/get', methods=['GET'])
def get_answer():
    session = Session()
    try:
        request_type = request.args.get('type')
        request_year = request.args.get('year')
        student_id = request.args.get('student_id')
        start_year = request.args.get('start_year')
        end_year = request.args.get('end_year')
        label = request.args.get('label')
        question_id = request.args.get('question_id')

        if start_year and end_year and label and request_type:
            return get_answer_by_start_end_label_type(start_year, end_year, label, request_type, session)

        if request_type and start_year and end_year:
            return get_answer_by_type_start_end(request_type, start_year, end_year, session)

        if request_year and student_id:
            return get_answer_by_year_id(request_year, student_id, session)

        if request_type and request_year:
            return get_answer_by_type_year(request_type, request_year, session)

        if student_id:
            return get_answer_by_id(student_id, session)
            
        if question_id:
            return get_answer_by_question_id(question_id, session)
        
        return jsonify({'error': 'invalid url'}), 400
        
    except Exception as e:
        print(e)
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 400
    finally:
        session.close()

############################################################
# Error Handling                                           #
############################################################
@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    app.run(debug=True)
