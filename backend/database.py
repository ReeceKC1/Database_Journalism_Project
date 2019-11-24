from sqlalchemy import *
from sqlalchemy.sql import text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#  Creating/Getting database
engine = create_engine('mysql+pymysql://user:password@159.203.125.59:3306/database')
# Creating metadata object
metadata = MetaData()
# Creating metadata object

Session = sessionmaker(bind=engine)
session = Session()

Base = declarative_base(metadata)
connection = engine.connect()
# Declaring tables with attributes
class Student(Base):
    __tablename__ = 'student'
    student_id = Column('student_id', String(255), unique = True, primary_key = True)
    first_name = Column('first_name', String(255))
    last_name = Column('last_name', String(255))
    class_year = Column('class', String(255))
    email = Column('email', String(255))
    semester_of_completion = Column('semester_of_completion', String(255))
    grade = Column('grade', String(255))
    pr_major_minor = Column('pr_major_minor', String(255))

class Company(Base):
    __tablename__ = 'company'
    company_name = Column('company_name', String(255), unique = True, primary_key = True)
    address = Column('address', String(255))
    phone = Column('phone', String(255))

class Supervisor(Base):
    __tablename__ = 'supervisor'
    email = Column('email', String(255), unique = True, primary_key = True)
    name = Column('name', String(255))
    title = Column('title', String(255))
    company_name = Column('company_name', String(255), ForeignKey('company.company_name'))


class Internship(Base):
    __tablename__ = 'internship'
    student_id = Column('student_id', String(255), ForeignKey('student.student_id'), primary_key = True)
    company_name = Column('company_name', String(255), ForeignKey('company.company_name'), primary_key = True)
    start_date = Column('start_date', String(255), primary_key = True)
    end_date = Column('end_date', String(255))
    supervisor_email = Column('supervisor_email', String(255), ForeignKey('supervisor.email'))
    hours = Column('hours', Float)

class Evaluation(Base):
    __tablename__ = 'evaluation'
    year = Column('year', String(255), index = True, primary_key = True)
    eval_type = Column('eval_type', String(255), index = True, primary_key = True)
    title = Column('title', String(255))
    version = Column('version', String(255))

    @property
    def seralize(self):
        return {
            'year' : self.year,
            'eval_type' : self.eval_type,
            'title' : self.title,
            'version' : self.version
        }

class Question(Base):
    __tablename__ = 'question'
    evaluation_year = Column('evaluation_year', String(255), ForeignKey('evaluation.year'), primary_key = True)
    evaluation_type = Column('evaluation_type', String(255), ForeignKey('evaluation.eval_type'), primary_key = True)
    question_id = Column('question_id', String(255), index = True, unique = True, primary_key = True)
    label = Column('label', String(255))
    question_text = Column('question_text', String(255))

class Option(Base):
    __tablename__ = 'option'
    question_id = Column('question_id', String(255), ForeignKey('question.question_id'), primary_key = True)
    option_text = Column('option_text', String(255), index = True, primary_key = True)
    option_weight = Column('option_weight', String(255))

class Comment(Base):
    __tablename__ = 'comment'
    comment_id = Column('comment_id', String(255), unique = True, primary_key = True)
    comment_text = Column('comment_text', String(255))

class Evaluation_Answers(Base):
    __tablename__ = 'evaluation_answers'
    eval_type = Column('eval_type', String(255), ForeignKey('evaluation.type'), primary_key = True)
    eval_year = Column('eval_year', String(255), ForeignKey('evaluation.year'), primary_key = True)
    student_id = Column('student_id', String(255), ForeignKey('student.student_id'), primary_key = True)
    company_name = Column('company_name', String(255), ForeignKey('company.company_name'), primary_key = True)
    supervisor_email = Column('supervisor_email', String(255), ForeignKey('supervisor.email'), primary_key = True)
    answer_id = Column('answer_id', String(255), index = True, unique = True, primary_key = True)
    comment_id = Column('comment_id', String(255), ForeignKey('comment.comment_id'))

class Portfolio_Answers(Base):
    __tablename__ = 'portfolio_answers'
    eval_type = Column('eval_type', String(255), ForeignKey('evaluation.type'), primary_key = True)
    eval_year = Column('eval_year', String(255), ForeignKey('evaluation.year'), primary_key = True)
    student_id = Column('student_id', String(255), ForeignKey('student.student_id'), primary_key = True)
    company_name = Column('company_name', String(255), ForeignKey('company.company_name'), primary_key = True)
    supervisor_email = Column('supervisor_email', String(255), ForeignKey('supervisor.email'), primary_key = True)
    answer_id = Column('answer_id', String(255), index = True, unique = True, primary_key = True)
    date_reviewed = Column('date_reviewed', Date, primary_key = True)

class Eval_Answer(Base):
    __tablename__ = 'eval_answer'
    answer_id = Column('answer_id', String(255), ForeignKey('evaluation_answers.answer_id'), primary_key = True)
    option_text = Column('option_text', String(255), ForeignKey('option.option_text'), primary_key = True)
    question_id = Column('question_id', String(255), ForeignKey('question.question_id'), primary_key = True)

class Port_Answer(Base):
    __tablename__ = 'port_answer'
    answer_id = Column('answer_id', String(255), ForeignKey('portfolio_answers.answer_id'), primary_key = True)
    option_text = Column('option_text', String(255), ForeignKey('option.option_text'), primary_key = True)
    question_id = Column('question_id', String(255), ForeignKey('question.question_id'), primary_key = True)
    comment_id =Column('comment_id', String(255), ForeignKey('comment.comment_id'))

# Creating tables
metadata.create_all(engine)