from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.admin import ModelAdmin
from .models import User, Course, Offering, Exercise, Answer


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
