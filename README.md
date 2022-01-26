# Developer Life Support API

![Django CI](https://github.com/insper-education/devlife-support-api/actions/workflows/django.yml/badge.svg)
![NodeJS CI](https://github.com/insper-education/devlife-support-api/actions/workflows/node.js.yml/badge.svg)

## API Documentation

Currently available:

- `/auth/`
  - `/auth/password/reset/`
  - `/auth/password/reset/confirm/`
  - `/auth/login/`
  - `/auth/logout/`
  - `/auth/user/`
  - `/auth/password/change/`
- `/api/users/`
  - `/api/users/{ID}/`
- `/api/offerings/{OFF_ID}/exercises/{EX_ID}/answers/{ANS_ID}/previous/` (previous answer for this user and exercise)
- `/api/offerings/{OFF_ID}/exercises/{EX_ID}/answers/{ANS_ID}/next/` (next answer for this user and exercise)

## References

- Django + React: https://medium.com/@meric.emmanuel/how-to-connect-django-with-create-react-app-d1581139cad1
- React project structure from: https://github.com/IgneousGuikas/react-project-guide

## Docker

    docker build -t devlife-support .
    
    # To run locally
    docker run -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=db postgres:13.0-alpine
    
    # For testing run both commands simultaneously (on different terminals) 
    docker run -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=test_db postgres:13.0-alpine
    docker run -v $PWD:/app -p 8000:8000 devlife-support
