FROM python:3
RUN mkdir -p /app
COPY . /app
WORKDIR /app
RUN pip install --upgrade pip
RUN python -m pip install -r requirements.txt

CMD python manage.py migrate && python manage.py runserver 0.0.0.0:8000
