from django import http
from django.http.response import Http404
from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes

from django.shortcuts import get_object_or_404

from .models import Answer, Offering, User, Exercise, UserAnswerSummary,Student
from .serializers import AnswerSerializer, UserAnswerSummarySerializer, UserSerializer, ExerciseSerializer
from .permissions import IsAdminOrSelf, IsAdminUser, IsEnrolledInOfferingOrIsStaff


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrSelf]


class ExerciseViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = ExerciseSerializer

    def get_permissions(self):
        permissions = [IsAdminUser]
        if self.action == 'list':
            permissions = [IsEnrolledInOfferingOrIsStaff]

        return [permission() for permission in permissions]

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
        return Response(s.data, status=status.HTTP_201_CREATED)

    def list(self, request, off_pk=None):
        offering = get_object_or_404(Offering, pk=off_pk)
        exercises_json = ExerciseSerializer(offering.exercise_set.all(), many=True)
        return Response(exercises_json.data)


class AnswerViewSet(viewsets.ModelViewSet):
    serializer_class = AnswerSerializer
    permission_classes = [IsEnrolledInOfferingOrIsStaff]

    def get_queryset(self):
        get_object_or_404(Offering, pk=self.kwargs.get('off_pk'))
        exercise = get_object_or_404(Exercise, slug=self.kwargs.get('ex_slug'))

        filters = {
            'exercise': exercise
        }

        if 'student_pk' in self.kwargs and self.request.user.is_staff:
            filters['user'] = self.kwargs.get('student_pk')
        elif not self.request.user.is_staff:
            filters['user'] = self.request.user

        return Answer.objects.filter(**filters)

    def create(self, request, off_pk=None, ex_slug=None):
        get_object_or_404(Offering, pk=off_pk)
        exercise = get_object_or_404(Exercise, slug=ex_slug)

        answer_data = {
            'user': request.user.pk,
            'exercise': exercise.pk,
            'test_results': request.data['test_results'],
            'student_input': request.data['student_input'],
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
@permission_classes([IsEnrolledInOfferingOrIsStaff])
def get_previous_answer(request, off_pk, ex_slug, ans_pk):
    get_object_or_404(Offering, pk=off_pk)

    filters = user_filter(request)
    try:
        answer = Answer.objects.filter(
            exercise__pk=ex_slug,
            pk__lt=ans_pk,
            **filters).latest('pk')
    except Answer.DoesNotExist:
        raise Http404()
    return Response(AnswerSerializer(answer).data)


@api_view(['GET'])
@permission_classes([IsEnrolledInOfferingOrIsStaff])
def get_next_answer(request, off_pk, ex_slug, ans_pk):
    get_object_or_404(Offering, pk=off_pk)

    filters = user_filter(request)
    try:
        answer = Answer.objects.filter(
            exercise__pk=ex_slug,
            pk__gt=ans_pk,
            **filters).earliest('pk')
    except Answer.DoesNotExist:
        raise Http404()
    return Response(AnswerSerializer(answer).data)


@api_view(['GET'])
@permission_classes([IsEnrolledInOfferingOrIsStaff])
def list_summaries(request, off_pk):
    get_object_or_404(Offering, pk=off_pk)

    filters = user_filter(request)
    all_summaries = UserAnswerSummary.objects.filter(**filters)
    all_summaries_json = UserAnswerSummarySerializer(all_summaries, many=True)

    return Response(all_summaries_json.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsEnrolledInOfferingOrIsStaff])
def list_summaries_for_exercise(request, off_pk, ex_slug):
    get_object_or_404(Offering, pk=off_pk)
    exercise = get_object_or_404(Exercise, slug=ex_slug)

    filters = user_filter(request)
    filters['exercise'] = exercise
    all_summaries = UserAnswerSummary.objects.filter(**filters)
    all_summaries_json = UserAnswerSummarySerializer(all_summaries, many=True)

    return Response(all_summaries_json.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_students_that_tried_exercise(request, off_pk, ex_slug):
    get_object_or_404(Offering, pk=off_pk)
    exercise = get_object_or_404(Exercise, slug=ex_slug)
    all_students = [ans.user for ans in exercise.answer_set.all().distinct('user')]
    all_students_json = UserSerializer(all_students, many=True)

    return Response(all_students_json.data, status=status.HTTP_200_OK)
