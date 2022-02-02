from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.db.models import Max
from dj_rest_auth.views import PasswordResetView
from django.test.client import RequestFactory
from .models import Answer, Enrollment, Instructor, UserAnswerSummary, Student, User
from rest_framework.authtoken.models import Token


def update_summary(instance, using):
    user = instance.user
    exercise = instance.exercise
    user_answer, created = UserAnswerSummary.objects.using(using).get_or_create(
        user=user, exercise=exercise
    )
    answers = Answer.objects.using(using).filter(user=user, exercise=exercise)

    user_answer.answer_count = answers.count()
    user_answer.max_points = answers.aggregate(Max("points")).get("points__max")
    if not user_answer.max_points:
        user_answer.max_points = 0
    try:
        user_answer.latest = answers.latest("submission_date")
    except Answer.DoesNotExist:
        user_answer.latest = None
    user_answer.save()


@receiver(post_save, sender=Answer, dispatch_uid="48182593106723498")
def post_answer_save(sender, instance, created, raw, using, update_fields, **kwargs):
    update_summary(instance, using)


@receiver(post_delete, sender=Answer, dispatch_uid="27486702934857823")
def post_answer_delete(sender, instance, using, **kwargs):
    update_summary(instance, using)


@receiver(post_save, sender=Instructor, dispatch_uid='12354787867867864')
@receiver(post_save, sender=Student, dispatch_uid='23146778970987654')
@receiver(post_save, sender=User, dispatch_uid="7648819345678914")
def post_save_user_create_token(sender, instance, created, *args, **kwargs):
    if created:
        Token.objects.create(user=instance)


@receiver(post_save, sender=Enrollment, dispatch_uid='51349841263013489')
def post_save_enrollment_send_email(sender, instance, created, *args, **kwargs):
    offering = instance.offering
    client_url = offering.url
    student = instance.student
    if not student.password_email_sent and client_url:
        factory = RequestFactory()
        request = factory.post(
            f"/api/auth/password/reset/?offering={offering.id}&first_time=true",
            data={"email": student.email},
            content_type="application/json",
        )
        view = PasswordResetView.as_view()
        response = view(request)
        if response.status_code == 200:
            student.password_email_sent = True
            student.save()
