to create venv
     python -m venv database_env
activate venv
    source database_env/Scripts/activate
deactivate venv
    deactivate
get requirements.txt
    pip freeze > requirements.txt
install requirements.txt (must be in dir with requirements.txt)
    pip install -r requirements.txt

Notes:
    DO NOT COMMIT VIRTUAL ENVIRONMENTS
    DO NOT COMMIT __pycache__