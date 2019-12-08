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
                                        WHERE eval_type = '{param_type}' \
                                        AND year >= '{start_year}' \
                                        AND year <= '{end_year}'")).fetchall()

    obj_evaluations = []
    for evaluation in evaluations:
        evaluation = Evaluation(**evaluation)
        obj_evaluations.append(evaluation)

    return return_multiple_evaluations(obj_evaluations)

def get_evaluation_by_start_end(start_year, end_year):
    session = Session()

    evaluations = session.execute(text(f"SELECT * \
                                        FROM evaluation \
                                        WHERE year >= '{start_year}' \
                                        AND year <= '{end_year}'")).fetchall()
    
    obj_evaluations = []
    for evaluation in evaluations:
        evaluation = Evaluation(**evaluation)
        obj_evaluations.append(evaluation)

    return return_multiple_evaluations(obj_evaluations)

def get_evaluation_by_year(year):
    session = Session()

    evaluations = session.query(Evaluation).filter_by(year=year).all()

    return return_multiple_evaluations(evaluations)

def get_evaluation_by_type(param_type):
    session = Session()

    evaluations = session.query(Evaluation).filter_by(eval_type=param_type).all()

    return return_multiple_evaluations(evaluations)

def return_multiple_evaluations(evaluations):
    session = Session()
    eval_response = []
    if not evaluations:
        return jsonify({'error': 'evaluations not found'}), 400
    
    for evaluation in evaluations:
        evaluation = evaluation.seralize
        questions = session.query(Question).filter_by(evaluation_type=evaluation['eval_type'],evaluation_year=evaluation['year']).all()
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

    answers = session.execute(text(f"SELECT * \
                                     FROM evaluation_answers \
                                     WHERE eval_type = '{request_type}' \
                                     AND eval_year >= '{start_year}' \
                                     AND eval_year <= '{end_year}'")).fetchall()
    port_answers = session.execute(text(f"SELECT * \
                                          FROM portfolio_answers \
                                          WHERE eval_type = '{request_type}' \
                                          AND eval_year >= '{start_year}' \
                                          AND eval_year <= '{end_year}'")).fetchall()

    obj_answers = []
    for answer in answers:
        answer = Evaluation_Answers(**answer)
        obj_answers.append(answer)

    obj_port_answers = []
    for answer in port_answers:
        answer = Portfolio_Answers(**answer)
        obj_port_answers.append(answer)

    return get_answers(obj_answers, obj_port_answers)

def get_answer_by_start_end_label(start_year, end_year, label):
    session = Session()

    answers = session.execute(text(f"SELECT * \
                                     FROM evaluation_answers \
                                     WHERE eval_year >= '{start_year}' \
                                     AND eval_year <= '{end_year}'")).fetchall()
    port_answers = session.execute(text(f"SELECT * \
                                          FROM portfolio_answers \
                                          WHERE eval_year >= '{start_year}' \
                                          AND eval_year <= '{end_year}'")).fetchall()
    
    obj_answers = []
    for answer in answers:
        answer = Evaluation_Answers(**answer)
        obj_answers.append(answer)
    answers = obj_answers

    obj_port_answers = []
    for answer in port_answers:
        answer = Portfolio_Answers(**answer)
        obj_port_answers.append(answer)
    port_answers = obj_port_answers
    
    eval_answers_response = []
    for answer in answers:
        answer = answer.seralize

        answer['student'] = session.query(Student).filter_by(student_id=answer.pop('student_id')).one_or_none().seralize
        answer['company'] = session.query(Company).filter_by(company_name=answer.pop('company_name')).one_or_none().seralize
        answer['supervisor'] = session.query(Supervisor).filter_by(email=answer.pop('supervisor_email')).one_or_none().seralize

        answers = session.execute(text(f"SELECT answer_id, option_text, eval_answer.question_id \
                                         FROM eval_answer, question \
                                         WHERE answer_id = '{answer['answer_id']}' \
                                         AND label = '{label}'")).fetchall()
        obj_answers = []
        for temp_answer in answers:
            temp_answer = Eval_Answer(**temp_answer)
            obj_answers.append(temp_answer)
        answers = obj_answers
        answer['answers'] = [x.seralize for x in answers]

        answer['comment_text'] = session.query(Comment).filter_by(comment_id=answer.pop('comment_id')).one_or_none().comment_text
        eval_answers_response.append(answer)

    for answer in port_answers:
        answer = answer.seralize

        answer['student'] = session.query(Student).filter_by(student_id=answer.pop('student_id')).one_or_none()
        answers = session.execute(text(f"SELECT answer_id, option_text, port_answer.question_id \
                                         FROM port_answer, question \
                                         WHERE answer_id = '{answer['answer_id']}' \
                                         AND label = '{label}'")).fetchall()
        seralized_answers = []
        for obj in answers:
            obj['comment_text'] = session.query(Comment).filter_by(comment_id=obj.pop('comment_id')).one_or_none()
            obj_answers = []
            for temp_answer in answers:
                temp_answer = Port_Answer(**temp_answer)
                obj_answers.append(temp_answer)
            answers = obj_answers
            obj.seralize
            seralized_answers.append(obj)
        answer['answers'] = seralized_answers
        eval_answers_response.append(answer)
    
    return jsonify(eval_answers_response), 200

def get_answer_by_year_id(year, student_id):
    session = Session()

    answers = session.query(Evaluation_Answers).filter_by(eval_year=year, student_id=student_id).all()
    port_answers = session.query(Portfolio_Answers).filter_by(eval_year=year, student_id=student_id).all()

    return get_answers(answers, port_answers)

def get_answer_by_type_year(request_type, year):
    session = Session()

    answers = session.query(Evaluation_Answers).filter_by(eval_year=year, eval_type=request_type).all()
    port_answers = session.query(Portfolio_Answers).filter_by(eval_year=year, eval_type=request_type).all()

    return get_answers(answers, port_answers)

def get_answer_by_id(student_id):
    session = Session()

    answers = session.query(Evaluation_Answers).filter_by(student_id=student_id).all()
    port_answers = session.query(Portfolio_Answers).filter_by(student_id=student_id).all()

    return get_answers(answers, port_answers)

def get_answers(eval_answers, port_answers):
    session = Session()

    eval_answers_response = []
    for answer in eval_answers:
        answer = answer.seralize

        answer['student'] = session.query(Student).filter_by(student_id=answer.pop('student_id')).one_or_none().seralize
        answer['company'] = session.query(Company).filter_by(company_name=answer.pop('company_name')).one_or_none().seralize
        answer['supervisor'] = session.query(Supervisor).filter_by(email=answer.pop('supervisor_email')).one_or_none().seralize

        answers = session.query(Eval_Answer).filter_by(answer_id=answer['answer_id']).all()
        answer['answers'] = [x.seralize for x in answers]

        answer['comment_text'] = session.query(Comment).filter_by(comment_id=answer.pop('comment_id')).one_or_none().comment_text
        eval_answers_response.append(answer)

    for answer in port_answers:
        answer = answer.seralize

        answer['student'] = session.query(Student).filter_by(student_id=answer.pop('student_id')).one_or_none().seralize
        answers = session.query(Port_Answer).filter_by(answer_id=answer['answer_id']).all()
        seralized_answers = []
        for obj in answers:
            obj = obj.seralize
            obj['comment_text'] = session.query(Comment).filter_by(comment_id=obj.pop('comment_id')).one_or_none().seralize
            seralized_answers.append(obj)
        answer['answers'] = seralized_answers
        eval_answers_response.append(answer)
    
    return jsonify(eval_answers_response), 200