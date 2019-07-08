FROM python:2.7-alpine

WORKDIR /app

COPY requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt

COPY . /app/
COPY FlaskTools/config.py.example /app/FlaskTools/config.py

EXPOSE 5000

CMD python /app/runserver.py
