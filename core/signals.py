from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.db.models import Max
from .models import Answer, Instructor, UserAnswerSummary, Student, User
from rest_framework.authtoken.models import Token


def update_summary(instance, using):
    user = instance.user
    exercise = instance.exercise
    user_answer, created = UserAnswerSummary.objects.using(using).get_or_create(user=user, exercise=exercise)
    answers = Answer.objects.using(using).filter(user=user, exercise=exercise)

    user_answer.answer_count = answers.count()
    user_answer.max_points = answers.aggregate(Max('points')).get('points__max')
    if not user_answer.max_points:
        user_answer.max_points = 0
    try:
        user_answer.latest = answers.latest('submission_date')
    except Answer.DoesNotExist:
        user_answer.latest = None
    user_answer.save()


@receiver(post_save, sender=Answer, dispatch_uid='48182593106723498')
def post_answer_save(sender, instance, created, raw, using, update_fields, **kwargs):
    update_summary(instance, using)


@receiver(post_delete, sender=Answer, dispatch_uid='27486702934857823')
def post_answer_delete(sender, instance, using, **kwargs):
    update_summary(instance, using)

@receiver(post_save, sender=Instructor, dispatch_uid='12354787867867864')
@receiver(post_save, sender=Student, dispatch_uid='23146778970987654')
def post_save_user_create_token(sender, instance, created, *args, **kwargs):
    if created:
        Token.objects.create(user=instance)