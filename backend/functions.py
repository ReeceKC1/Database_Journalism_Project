from flask import *
from sqlalchemy import *
from sqlalchemy.sql import text
from enums import *
from database import *
from flask_cors import CORS
import uuid 

############################################################
# Evaluation Functions                                     #
############################################################
def get_evaluation_by_key(param_type, param_year):
    session = Session()
    
    # Query for evaluation and questions
    evaluation = session.query(Evaluation).filter_by(eval_type=param_type, year=param_year).one_or_none()
    
    if not evaluation:
        return jsonify({'error': 'evaluation not found'}), 400
    
    questions = session.query(Question).filter_by(evaluation_type=param_type, evaluation_year=param_year).all()
    evaluation = evaluation.seralize
    questions.sort(key=lambda x : x.order_value)

    # Query and format questions for evaluation
    seralized_questions = []
    for obj in questions:
        obj = obj.seralize
        options = session.query(Option).filter_by(question_id=obj['question_id']).all()
        options.sort(key=lambda x : x.option_weight)

        # Query and format options for question
        serialized_options = []
        for opt in options:
            opt = opt.seralize
            serialized_options.append(opt)
        obj['options'] = serialized_options
        seralized_questions.append(obj)
    evaluation['questions'] = seralized_questions
        
    return jsonify(evaluation), 200

def get_evaluation_by_type_start_end(param_type, start_year, end_year):
    session = Session()

    evaluations = session.execute(text(f"SELECT * \
                                        FROM evaluation \
                                        WHERE eval_type = {param_type} \
                                        AND year >= '{start_year}' \
                                        AND year <= '{end_year}'"))

    return return_multiple_evaluations(evaluations)

def get_evaluation_by_type_start_end(start_year, end_year):
    session = Session()

    evaluations = session.execute(text(f"SELECT * \
                                        FROM evaluation \
                                        WHERE year >= '{start_year}' \
                                        AND year <= '{end_year}'"))

    return return_multiple_evaluations(evaluations)

def get_evaluation_by_year(year):
    session = Session()

    evaluations = session.query(Evaluation).filter_by(evaluation_year=year).all()

    return return_multiple_evaluations(evaluations)

def get_evaluation_by_type(param_type):
    session = Session()

    evaluations = session.query(Evaluation).filter_by(evaluation_type=param_type).all()

    return return_multiple_evaluations(evaluations)

def return_multiple_evaluations(evaluations):
    session = Session()
    eval_response = []
    if not evaluations:
        return jsonify({'error': 'evaluations not found'}), 400
    
    for evaluation in evaluations:
        evaluation = evaluation.seralize
        questions = session.query(Question).filter_by(evaluation_type=evaluation['evaluation_type'],evaluation_year=evaluation['evaluation_year'])
        questions.sort(key=lambda x : x.order_value)

        seralized_questions = []
        for question in questions:
            question = question.seralize
            options = session.query(Option).filter_by(question_id=question['question_id']).all()
            options.sort(key=lambda x : x.option_weight)

            # Query and format options for question
            serialized_options = []
            for option in options:
                option = option.seralize
                serialized_options.append(option)
            question['options'] = serialized_options
            seralized_questions.append(question)
        evaluation['questions'] = seralized_questions
        eval_response.append(evaluation)

    return jsonify(eval_response), 200

############################################################
# Answer Functions                                         #
############################################################
def get_answer_by_type_start_end(request_type, start_year, end_year):
    session = Session()
    return get_answers(answers)

def get_answer_by_start_end_label(start_year, end_year, label):
    session = Session()
    return get_answers(answers)

def get_answer_by_year_id(year, student_id):
    session = Session()
    answers = session.query()
    return get_answers(answers)

def get_answer_by_type_year(request_type, year):
    session = Session()
    return get_answers(answers)

def get_answer_by_id(student_id):
    session = Session()
    return get_answers(answers)

def get_answers(answers):
    session = Session()
    return