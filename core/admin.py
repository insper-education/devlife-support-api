from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.admin import ModelAdmin
from django.forms import ModelForm, FileField

from core.shortcuts import enroll_students, get_or_create_student_list

from .models import Enrollment, Instructor, Student, User, Course, Offering, Exercise, Answer, UserAnswerSummary


class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {
            'fields': ('password_email_sent',),
        }),
    )


class OfferingForm(ModelForm):
    blackboard_file = FileField(required=False)

    class Meta:
        model = Offering
        fields = '__all__'

class OfferingAdmin(ModelAdmin):
    fieldsets = ((None, {
        'fields': (
            'course',
            'url',
            'description',
        )
    }), ('Blackboard student list', {
        'fields': ('blackboard_file', )
    }))

    form = OfferingForm

    def enroll(self, blackboard_file, offering):
        if blackboard_file is None:
            return
        students = get_or_create_student_list(blackboard_file)
        enroll_students(students, offering)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        self.enroll(form.cleaned_data.get('blackboard_file'), obj)


admin.site.register(Course)
admin.site.register(Offering, OfferingAdmin)
admin.site.register(Exercise)
admin.site.register(Answer)
admin.site.register(UserAnswerSummary)
admin.site.register(Student, UserAdmin)
admin.site.register(Instructor, UserAdmin)
admin.site.register(Enrollment)
