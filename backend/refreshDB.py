from database import *
# Creating metadata object

try:
    Internship.__table__.drop(engine)
    print("Internship Table Dropped!")
except Exception as e:
    print("Internship Table might have been dropped already: ")

try: 
    Eval_Answer.__table__.drop(engine)
    print("Eval_Answer Table Dropped!")
except Exception as e:
    print("Eval_Answer Table might have been dropped already: ")

try:
    Port_Answer.__table__.drop(engine)
    print("Port_Answer Table Dropped!")
except Exception as e:
    print("Port_Answer Table might have been dropped already: ")

try:
    Comment.__table__.drop(engine)
    print("Comment Table Dropped!")
except Exception as e:
    print("Comment Table might have been dropped already: ")

try:
    Evaluation_Answers.__table__.drop(engine)
    print("Evaluation_Answers Table Dropped!")
except Exception as e:
    print("Evaluation_Answers Table might have been dropped already: ")

try:
    Portfolio_Answers.__table__.drop(engine)
    print("Portfolio_Answers Table Dropped!")
except Exception as e:
    print("Portfolio_Answers Table might have been dropped already: ")

try:
    Student.__table__.drop(engine)
    print("Student Table Dropped!")
except Exception as e:
    print("Student Table might have been dropped already: ")

try:
    Supervisor.__table__.drop(engine)
    print("Supervisor Table Dropped!")
except Exception as e:
    print("Supervisor Table might have been dropped already: ")

try:
    Company.__table__.drop(engine)
    print("Company Table Dropped!")
except Exception as e:
    print("Company Table might have been dropped already: ")

try:
    Option.__table__.drop(engine)
    print("Option Table Dropped!")
except Exception as e:
    print("Option might have been dropped already: ")

try:
    Question.__table__.drop(engine)
    print("Question Table Dropped!")
except Exception as e:
    print("Question Table might have been dropped already: ")

try:
    Evaluation.__table__.drop(engine)
    print("Evaluation Table Dropped!")
except Exception as e:
    print("Evaluation Table might have been dropped already: ")


















