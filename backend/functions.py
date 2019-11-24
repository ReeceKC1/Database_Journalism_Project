from flask import *
from sqlalchemy import *
from sqlalchemy.sql import text
from enums import *
from database import *
from flask_cors import CORS
import uuid 

# Function to get an evaluation based on type and year
def get_evaluation_by_key(param_type, param_year):
    session = Session()
    
    # Query for evaluation and questions
    evaluation = session.query(Evaluation).filter_by(eval_type=param_type, year=param_year).one_or_none()
    
    if not evaluation:
        return jsonify({'error': 'evaluation not found'}), 400
    
    questions = session.query(Question).filter_by(evaluation_type=param_type, evaluation_year=param_year).all()
    evaluation = evaluation.seralize

    # Query and format questions for evaluation
    seralized_questions = []
    for obj in questions:
        obj = obj.seralize
        options = session.query(Option).filter_by(question_id=obj['question_id'])
        serialized_options = []

        # Query and format options for question
        for opt in options:
            opt = opt.seralize
            serialized_options.append(opt)
        obj['options'] = serialized_options
        seralized_questions.append(obj)
    evaluation['questions'] = seralized_questions
        
    return jsonify(evaluation), 200
