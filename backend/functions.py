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
def get_evaluation_by_key(param_type, param_year, session):  
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

def get_evaluation_by_type_start_end(param_type, start_year, end_year, session):
    evaluations = session.execute(text(f"SELECT * \
                                        FROM evaluation \
                                        WHERE eval_type = '{param_type}' \
                                        AND year >= '{start_year}' \
                                        AND year <= '{end_year}'")).fetchall()

    obj_evaluations = []
    for evaluation in evaluations:
        evaluation = Evaluation(**evaluation)
        obj_evaluations.append(evaluation)

    return return_multiple_evaluations(obj_evaluations, session)

def get_evaluation_by_start_end(start_year, end_year, session):
    evaluations = session.execute(text(f"SELECT * \
                                        FROM evaluation \
                                        WHERE year >= '{start_year}' \
                                        AND year <= '{end_year}'")).fetchall()
    
    obj_evaluations = []
    for evaluation in evaluations:
        evaluation = Evaluation(**evaluation)
        obj_evaluations.append(evaluation)

    return return_multiple_evaluations(obj_evaluations, session)

def get_evaluation_by_year(year, session):
    evaluations = session.query(Evaluation).filter_by(year=year).all()

    return return_multiple_evaluations(evaluations, session)

def get_evaluation_by_type(param_type, session):

    evaluations = session.query(Evaluation).filter_by(eval_type=param_type).all()

    return return_multiple_evaluations(evaluations, session)

def return_multiple_evaluations(evaluations, session):
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
# Returns all evaluations matching the parameters and all answers for them
def get_answer_by_type_start_end(request_type, start_year, end_year, session):
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

    answers = [Evaluation_Answers(**x) for x in answers]

    port_answers = [Portfolio_Answers(**x) for x in port_answers]
    
    return get_answers(answers, port_answers, session)

# Returns all questions that have match the parameters and all answers to the questions
def get_answer_by_start_end_label_type(start_year, end_year, label, request_type, session):
    questions = session.execute(text(f"SELECT * \
                                     FROM question \
                                     WHERE evaluation_type = '{request_type}' \
                                     AND evaluation_year >= '{start_year}' \
                                     AND evaluation_year <= '{end_year}'\
                                     AND label = '{label}'")).fetchall()

    questions_response = []
    for question in questions:
        question = Question(**question)
        question = question.seralize

        options = session.query(Option).filter_by(question_id=question['question_id']).all()
        question['options'] = [x.seralize for x in options]

        if request_type == 'portfolio_eval':
            answers = session.query(Port_Answer).filter_by(question_id=question['question_id']).all()
        else:
            answers = session.query(Eval_Answer).filter_by(question_id=question['question_id']).all()

        question['answers'] = [x.seralize for x in answers]
        questions_response.append(question)
    
    return jsonify(questions_response), 200

# Returns all evaluations matching the year and student_id and all answers for them
def get_answer_by_year_id(year, student_id, session):
    answers = session.query(Evaluation_Answers).filter_by(eval_year=year, student_id=student_id).all()
    port_answers = session.query(Portfolio_Answers).filter_by(eval_year=year, student_id=student_id).all()

    return get_answers(answers, port_answers, session)

# Returns all evaluations matching the type and year and all answers for them
def get_answer_by_type_year(request_type, year, session):
    answers = session.query(Evaluation_Answers).filter_by(eval_year=year, eval_type=request_type).all()
    port_answers = session.query(Portfolio_Answers).filter_by(eval_year=year, eval_type=request_type).all()

    return get_answers(answers, port_answers, session)

# Returns all evaluations matching the student_id and all answers for them
def get_answer_by_id(student_id, session):
    answers = session.query(Evaluation_Answers).filter_by(student_id=student_id).all()
    port_answers = session.query(Portfolio_Answers).filter_by(student_id=student_id).all()

    return get_answers(answers, port_answers, session)

# Given evaluations returns all answers and data relating to the evaluations
def get_answers(eval_answers, port_answers, session):
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

def get_answer_by_question_id(q_id, session):

    answers = session.query(Port_Answer).filter_by(question_id=q_id).all()

    if len(answers) == 0:
        answers = session.query(Eval_Answer).filter_by(question_id=q_id).all()

    return jsonify([i.seralize for i in answers]), 200
