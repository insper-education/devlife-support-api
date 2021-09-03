from django import http
from django.http.response import Http404
from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view

from django.shortcuts import get_object_or_404

from .models import Answer, Offering, User, Exercise, UserAnswerSummary
from .serializers import AnswerSerializer, UserAnswerSummarySerializer, UserSerializer, ExerciseSerializer
from .permissions import IsAdminOrSelf, IsAdminUser


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrSelf]


class ExerciseViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = ExerciseSerializer
    permission_classes = [IsAdminUser]

    def create(self, request, off_pk=None):
        offering = get_object_or_404(Offering, pk=off_pk)

        exercise, new = offering.exercise_set.update_or_create(slug=request.data['slug'],
            defaults={
                'url': request.data['url'],
                'type': request.data['type'],
                'topic': request.data['topic'],
                'group': request.data['group'],
            })

        s = ExerciseSerializer(exercise)
        return Response(s.data)

    def list(self, request, off_pk=None):
        offering = get_object_or_404(Offering, pk=off_pk)
        exercises_json = ExerciseSerializer(offering.exercise_set.all(), many=True)
        return Response(exercises_json.data)


class AnswerViewSet(viewsets.ModelViewSet):
    serializer_class = AnswerSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        get_object_or_404(Offering, pk=self.kwargs.get('off_pk'))
        exercise = get_object_or_404(Exercise, slug=self.kwargs.get('ex_slug'))

        return Answer.objects.filter(exercise=exercise)

    def create(self, request, off_pk=None, ex_slug=None):
        get_object_or_404(Offering, pk=off_pk)
        exercise = get_object_or_404(Exercise, slug=ex_slug)

        answer_data = {
            'user': request.user.pk,
            'exercise': exercise.pk,
            'summary': request.data['summary'],
            'long_answer': request.data['long_answer'],
            'points': request.data['points']
        }

        answer = AnswerSerializer(data=answer_data)
        if answer.is_valid():
            answer.save()
            return Response(answer.data, status=status.HTTP_201_CREATED)

        return Response(answer.errors, status=status.HTTP_400_BAD_REQUEST)


def user_filter(request):
    user_pk = request.user.pk
    request_user_pk = request.GET.get('user')
    if request_user_pk and request_user_pk != user_pk and request.user.is_staff:
        user_pk = request_user_pk
    filters = {}
    if not request.user.is_staff or request_user_pk:
        # Can only see own summaries if not admin
        filters['user__pk'] = user_pk
    return filters


@api_view(['GET'])
def list_summaries(request, off_pk):
    get_object_or_404(Offering, pk=off_pk)

    filters = user_filter(request)
    all_summaries = UserAnswerSummary.objects.filter(**filters)
    all_summaries_json = UserAnswerSummarySerializer(all_summaries, many=True)

    return Response(all_summaries_json.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def list_summaries_for_exercise(request, off_pk, ex_slug):
    get_object_or_404(Offering, pk=off_pk)
    exercise = get_object_or_404(Exercise, slug=ex_slug)

    filters = user_filter(request)
    filters['exercise'] = exercise
    all_summaries = UserAnswerSummary.objects.filter(**filters)
    all_summaries_json = UserAnswerSummarySerializer(all_summaries, many=True)

    return Response(all_summaries_json.data, status=status.HTTP_200_OK)

