from flask import *
from sqlalchemy import *
from sqlalchemy.sql import text
from functions import *
from enums import *

# Creating/Getting database
engine = create_engine('mysql://user:password@159.203.125.59:3306/database')
# Creating metadata object
metadata = MetaData()
# Creating metadata object
connection = engine.connect()
# Declaring tables with attributes
student = Table('student', metadata,
    Column('student_id', String(255), unique = True, primary_key = True),
    Column('first_name', String(255)),
    Column('last_name', String(255)),
    Column('class', String(255)),
    Column('email', String(255)),
    Column('semester_of_completion', String(255)),
    Column('grade', String(255)),
    Column('pr_major_minor', String(255)),
)
company = Table('company', metadata,
    Column('company_name', String(255), unique = True, primary_key = True),
    Column('address', String(255)),
    Column('phone', String(255)),
)
supervisor = Table('supervisor', metadata,
    Column('email', String(255), unique = True, primary_key = True),
    Column('name', String(255)),
    Column('title', String(255)),
    Column('company_name', String(255), ForeignKey('company.company_name')),
)
internship = Table('internship', metadata,
    Column('student_id', String(255), ForeignKey('student.student_id'), primary_key = True),
    Column('company_name', String(255), ForeignKey('company.company_name'), primary_key = True),
    Column('start_date', String(255), primary_key = True),
    Column('end_date', String(255)),
    Column('supervisor_email', String(255), ForeignKey('supervisor.email')),
    Column('hours', Float),
)
evaluation = Table('evaluation', metadata,
    Column('year', String(255), primary_key = True),
    Column('type', String(255), primary_key = True),
    Column('title', String(255)),
    Column('version', String(255)),
)
question = Table('question', metadata,
    Column('evaluation_year', String(255), ForeignKey('evaluation.year'), primary_key = True),
    Column('evaluation_type', String(255), ForeignKey('evaluation.type'), primary_key = True),
    Column('question_id', String(255), unique = True, primary_key = True),
    Column('label', String(255)),
    Column('question_text', String(255)),
)
option = Table('option', metadata,
    Column('question_id', String(255), ForeignKey('question.question_id'), primary_key = True),
    Column('option_text', String(255), primary_key = True),
    Column('option_weight', String(255)),
)
comment = Table('comment', metadata,
    Column('comment_id', String(255), unique = True, primary_key = True),
    Column('comment_text', String(255)),
)
evaluation_answers = Table('evaluation_answers', metadata,
    Column('eval_type', String(255), ForeignKey('evaluation.type'), primary_key = True),
    Column('eval_year', String(255), ForeignKey('evaluation.year'), primary_key = True),
    Column('student_id', String(255), ForeignKey('student.student_id'), primary_key = True),
    Column('company_name', String(255), ForeignKey('company.company_name'), primary_key = True),
    Column('supervisor_email', String(255), ForeignKey('supervisor.email'), primary_key = True),
    Column('answer_id', String(255), unique = True, primary_key = True),
    Column('comment_id', String(255), ForeignKey('comment.comment_id')),
)
portfolio_answers = Table('portfolio_answers', metadata,
    Column('eval_type', String(255), ForeignKey('evaluation.type'), primary_key = True),
    Column('eval_year', String(255), ForeignKey('evaluation.year'), primary_key = True),
    Column('student_id', String(255), ForeignKey('student.student_id'), primary_key = True),
    Column('company_name', String(255), ForeignKey('company.company_name'), primary_key = True),
    Column('supervisor_email', String(255), ForeignKey('supervisor.email'), primary_key = True),
    Column('answer_id', String(255), unique = True, primary_key = True),
    Column('date_reviewed', Date, primary_key = True),
)
eval_answer = Table('eval_answer', metadata,
    Column('answer_id', String(255), ForeignKey('evaluation_answers.answer_id'), primary_key = True),
    Column('option_text', String(255), ForeignKey('option.option_text'), primary_key = True),
    Column('question_id', String(255), ForeignKey('question.question_id'), primary_key = True),
)
port_answer = Table('port_answer', metadata,
    Column('answer_id', String(255), ForeignKey('portfolio_answers.answer_id'), primary_key = True),
    Column('option_text', String(255), ForeignKey('option.option_text'), primary_key = True),
    Column('question_id', String(255), ForeignKey('question.question_id'), primary_key = True),
    Column('comment_id', String(255), ForeignKey('comment.comment_id')),
)
# Creating tables
metadata.create_all(engine)


app = Flask(__name__)

@app.route('/')
def home():
    return "goodbye"

@app.route('/add', methods=['GET'])
def add_student():
    connection.execute(text(f''))

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    app.run(debug=True)

connection.close()