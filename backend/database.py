from sqlalchemy import *
from sqlalchemy.sql import text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#  Creating/Getting database
engine = create_engine('mysql+pymysql://user:password@159.203.125.59:3306/database')
# Creating metadata object
metadata = MetaData()
# Creating session object
Session = sessionmaker(bind=engine)
#  Declaring base for table classes
Base = declarative_base(metadata)
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

    @property
    def seralize(self):
        return {
            'student_id' : self.student_id,
            'first_name' : self.first_name,
            'last_name' : self.last_name,
            'class_year' : self.class_year,
            'email' : self.email,
            'semester_of_completion' : self.semester_of_completion,
            'grade' : self.grade,
            'pr_major_minor' : self.pr_major_min
        }

class Company(Base):
    __tablename__ = 'company'
    company_name = Column('company_name', String(255), unique = True, primary_key = True)
    address = Column('address', String(255))
    phone = Column('phone', String(255))

    @property
    def seralize(self):
        return {
            'company_name' : self.company_name,
            'address' : self.address,
            'phone' : self.phone
        }

class Supervisor(Base):
    __tablename__ = 'supervisor'
    email = Column('email', String(255), unique = True, primary_key = True)
    name = Column('name', String(255))
    title = Column('title', String(255))
    company_name = Column('company_name', String(255), ForeignKey('company.company_name'))

    @property
    def seralize(self):
        return {
            'email' : self.email,
            'name' : self.name,
            'title' : self.title,
            'company_name' : self.company_name
        }


class Internship(Base):
    __tablename__ = 'internship'
    student_id = Column('student_id', String(255), ForeignKey('student.student_id'), primary_key = True)
    company_name = Column('company_name', String(255), ForeignKey('company.company_name'), primary_key = True)
    start_date = Column('start_date', String(255), primary_key = True)
    end_date = Column('end_date', String(255))
    supervisor_email = Column('supervisor_email', String(255), ForeignKey('supervisor.email'))
    hours = Column('hours', Float)

    @property
    def seralize(self):
        return {
            'student_id' : self.student_id,
            'company_name' : self.company_name,
            'start_date' : self.start_date,
            'end_date' : self.end_date,
            'supervisor_email' : self.supervisor_email,
            'hours' : self.hours
        }

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
    order_value = Column('order_value', String(255))

    @property
    def seralize(self):
        return {
            'evaluation_year' : self.evaluation_year,
            'evaluation_type' : self.evaluation_type,
            'question_id' : self.question_id,
            'label' : self.label,
            'question_text' : self.question_text,
            'order_value': self.order_value
        }

class Option(Base):
    __tablename__ = 'option'
    question_id = Column('question_id', String(255), ForeignKey('question.question_id'), primary_key = True)
    option_text = Column('option_text', String(255), index = True, primary_key = True)
    option_weight = Column('option_weight', String(255))

    @property
    def seralize(self):
        return {
            'question_id' : self.question_id,
            'option_text' : self.option_text,
            'option_weight' : self.option_weight
        }

class Comment(Base):
    __tablename__ = 'comment'
    comment_id = Column('comment_id', String(255), unique = True, primary_key = True)
    comment_text = Column('comment_text', String(255))

    @property
    def seralize(self):
        return {
            'comment_id' : self.comment_id,
            'comment_text' : self.comment_text
        }

class Evaluation_Answers(Base):
    __tablename__ = 'evaluation_answers'
    eval_type = Column('eval_type', String(255), ForeignKey('evaluation.type'), primary_key = True)
    eval_year = Column('eval_year', String(255), ForeignKey('evaluation.year'), primary_key = True)
    student_id = Column('student_id', String(255), ForeignKey('student.student_id'), primary_key = True)
    company_name = Column('company_name', String(255), ForeignKey('company.company_name'), primary_key = True)
    supervisor_email = Column('supervisor_email', String(255), ForeignKey('supervisor.email'), primary_key = True)
    answer_id = Column('answer_id', String(255), index = True, unique = True, primary_key = True)
    comment_id = Column('comment_id', String(255), ForeignKey('comment.comment_id'))

    @property
    def seralize(self):
        return {
            'eval_type' : self.eval_type,
            'eval_year' : self.eval_year,
            'student_id' : self.student_id,
            'company_name' : self.company_name,
            'supervisor_email' : self.supervisor_email,
            'answer_id' : self.answer_id,
            'comment_id' : self.comment_id
        }

class Portfolio_Answers(Base):
    __tablename__ = 'portfolio_answers'
    eval_type = Column('eval_type', String(255), ForeignKey('evaluation.type'), primary_key = True)
    eval_year = Column('eval_year', String(255), ForeignKey('evaluation.year'), primary_key = True)
    student_id = Column('student_id', String(255), ForeignKey('student.student_id'), primary_key = True)
    company_name = Column('company_name', String(255), ForeignKey('company.company_name'), primary_key = True)
    supervisor_email = Column('supervisor_email', String(255), ForeignKey('supervisor.email'), primary_key = True)
    answer_id = Column('answer_id', String(255), index = True, unique = True, primary_key = True)
    date_reviewed = Column('date_reviewed', Date, primary_key = True)

    @property
    def seralize(self):
        return {
            'eval_type' : self.eval_type,
            'eval_year' : self.eval_year,
            'student_id' : self.student_id,
            'company_name' : self.company_name,
            'supervisor_email' : self.supervisor_email,
            'answer_id' : self.answer_id,
            'date_reviewed' : self.date_reviewed
        }

class Eval_Answer(Base):
    __tablename__ = 'eval_answer'
    answer_id = Column('answer_id', String(255), ForeignKey('evaluation_answers.answer_id'), primary_key = True)
    option_text = Column('option_text', String(255), ForeignKey('option.option_text'), primary_key = True)
    question_id = Column('question_id', String(255), ForeignKey('question.question_id'), primary_key = True)

    @property
    def seralize(self):
        return {
            'answer_id' : self.answer_id,
            'option_text' : self.option_text,
            'question_id' : self.question_id
        }

class Port_Answer(Base):
    __tablename__ = 'port_answer'
    answer_id = Column('answer_id', String(255), ForeignKey('portfolio_answers.answer_id'), primary_key = True)
    option_text = Column('option_text', String(255), ForeignKey('option.option_text'), primary_key = True)
    question_id = Column('question_id', String(255), ForeignKey('question.question_id'), primary_key = True)
    comment_id =Column('comment_id', String(255), ForeignKey('comment.comment_id'))

    @property
    def seralize(self):
        return {
            'answer_id' : self.answer_id,
            'option_text' : self.option_text,
            'question_id' : self.question_id,
            'comment_id' : self.comment_id
        }

# Creating tables
metadata.create_all(engine)