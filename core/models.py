from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime


class User(AbstractUser):
    pass

class Student(User):
    pass


class Instructor(User):
    pass


class Course(models.Model):
    name = models.TextField(max_length=30)

    def __str__(self) -> str:
        return self.name


class Offering(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    description = models.TextField()

    def __str__(self) -> str:
        return self.course.name + self.description


class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    offering = models.ForeignKey(Offering, on_delete=models.CASCADE)


class Teaches(models.Model):
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE)
    offering = models.ForeignKey(Offering, on_delete=models.CASCADE)


class Exercise(models.Model):
    offering = models.ForeignKey(Offering, on_delete=models.CASCADE)
    slug = models.SlugField()
    url = models.URLField()

    class ExerciseType(models.TextChoices):
        CODE = 'CODE', 'Code'
        QUIZ = 'QUIZ', 'Quiz'
        TEXT = 'TEXT', 'Text'

    type = models.CharField(max_length=4, choices=ExerciseType.choices)

    def __str__(self) -> str:
        return self.slug


class Answer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    points = models.FloatField()
    submission_date = models.DateTimeField(default=datetime.utcnow)
    summary = models.JSONField()
    long_answer = models.JSONField()

    def __str__(self) -> str:
        return f'{self.exercise} -> {self.user.username} ({self.submission_date})'