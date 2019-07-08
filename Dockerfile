FROM python:2.7

WORKDIR /app

COPY requirements.txt /app/requirements.txt

COPY FlaskTools/config.py.example /app/FlaskTools/config.py

RUN sed -i 's/DATA_FOLDER = ""/DATA_FOLDER = "/app/tools"' /app/FlaskTools/config.py

RUN pip install -r /app/requirements.txt

EXPOSE 5000

CMD python /app/runserver.py
