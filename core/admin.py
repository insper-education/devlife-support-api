from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.admin import ModelAdmin
from .models import Enrollment, Instructor, Student, User, Course, Offering, Exercise, Answer, UserAnswerSummary


class CourseAdmin(ModelAdmin):
    pass


class OfferingAdmin(ModelAdmin):
    pass


class ExerciseAdmin(ModelAdmin):
    pass


class AnswerAdmin(ModelAdmin):
    pass


admin.site.register(User, UserAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(Offering, OfferingAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(Answer, AnswerAdmin)
admin.site.register(UserAnswerSummary)
admin.site.register(Student)
admin.site.register(Instructor)
admin.site.register(Enrollment)
