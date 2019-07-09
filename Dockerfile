FROM tiangolo/uwsgi-nginx-flask:python2.7-alpine3.8

WORKDIR /app

COPY nginx.conf /tmp/nginx.conf

COPY configure-nginx.sh /app/prestart.sh

COPY requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt

COPY ./app /app
