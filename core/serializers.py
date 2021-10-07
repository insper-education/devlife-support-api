from rest_framework import serializers
from dj_rest_auth.serializers import PasswordResetSerializer
from .models import Answer, User, Exercise, UserAnswerSummary


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["pk", "username", "first_name", "last_name", "email", "is_staff"]


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ["pk", "slug", "url", "type", "offering", "topic", "group"]


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = [
            "pk",
            "user",
            "exercise",
            "points",
            "submission_date",
            "test_results",
            "student_input",
        ]


class UserAnswerSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnswerSummary
        fields = ["pk", "user", "exercise", "max_points", "answer_count", "latest"]


class CustomPasswordResetSerializer(PasswordResetSerializer):
    def get_email_options(self):
        request = self.context.get("request")
        first_time = False
        if request:
            first_time = request.GET.get("first_time", False)
        return {
            "email_template_name": "registration/password_reset_email.txt",
            "subject_template_name": "registration/password_reset_subject.txt",
            "extra_email_context": {"first_time": first_time},
        }
