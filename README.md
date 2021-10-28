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
    docker run -v $PWD:/app -p 8000:8000 devlife-support
