from rest_framework import serializers
from dj_rest_auth.serializers import PasswordResetSerializer
from .models import Answer, Offering, User, Exercise, UserAnswerSummary


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["pk", "username", "first_name", "last_name", "email", "is_staff"]


class OfferingSerializer(serializers.ModelSerializer):
    course_name = serializers.SerializerMethodField()

    def get_course_name(self, obj):
        return obj.course.name

    class Meta:
        model = Offering
        fields = ["pk", "course_name", "description", "url"]


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
    exercise_slug = serializers.SerializerMethodField()
    exercise_type = serializers.SerializerMethodField()

    def get_exercise_slug(self, obj):
        return obj.exercise.slug

    def get_exercise_type(self, obj):
        return obj.exercise.type
    class Meta:
        model = UserAnswerSummary
        fields = ["pk", "user", "exercise", "exercise_slug", "exercise_type", "max_points", "answer_count", "latest"]


class CustomPasswordResetSerializer(PasswordResetSerializer):
    def get_email_options(self):
        request = self.context.get("request")

        client_url = None
        first_time = False
        if request:
            first_time = request.GET.get("first_time", False)
            offering_id = request.GET.get("offering")
            if offering_id:
                offering = Offering.objects.get(pk=int(offering_id))
                client_url = offering.url
        assert client_url, 'offering url param is required'
        return {
            "email_template_name": "registration/password_reset_email.txt",
            "subject_template_name": "registration/password_reset_subject.txt",
            "extra_email_context": {
                "first_time": first_time,
                "client_url": client_url,
            },
        }
