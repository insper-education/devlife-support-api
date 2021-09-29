from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.admin import ModelAdmin
from .models import Enrollment, Instructor, Student, User, Course, Offering, Exercise, Answer, UserAnswerSummary

admin.site.register(Course)
admin.site.register(Offering)
admin.site.register(Exercise)
admin.site.register(Answer)
admin.site.register(UserAnswerSummary)
admin.site.register(Student)
admin.site.register(Instructor)
admin.site.register(Enrollment)
