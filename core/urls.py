from django.urls import include, path, re_path
from rest_framework import routers
from core import views

users_router = routers.DefaultRouter()
users_router.register(r'users', views.UserViewSet)

answers_router = routers.DefaultRouter()
answers_router.register(r'answers', views.AnswerViewSet, basename='answers')

urlpatterns = [
    path(r'offerings/<int:off_pk>/exercises/<slug:ex_slug>/answers/latest/<int:student_pk>/', views.get_latest_answer_by_student),
    path(r'offerings/<int:off_pk>/exercises/<slug:ex_slug>/answers/students/', views.list_students_that_tried_exercise),
    path(r'offerings/<int:off_pk>/exercises/<slug:ex_slug>/answers/students/<int:student_pk>', views.AnswerViewSet.as_view({'get': 'list_answers_by_student'})),
    path(r'offerings/<int:off_pk>/exercises/<slug:ex_slug>/answers/<int:ans_pk>/', views.get_answer),
    path(r'offerings/<int:off_pk>/exercises/<slug:ex_slug>/answers/<int:ans_pk>/previous/', views.get_previous_answer),
    path(r'offerings/<int:off_pk>/exercises/<slug:ex_slug>/answers/<int:ans_pk>/next/', views.get_next_answer),
    path(r'offerings/<int:off_pk>/exercises/<slug:ex_slug>/', include(answers_router.urls)),
    path(r'offerings/<int:off_pk>/exercises/', views.ExerciseViewSet.as_view({'post': 'create',
                                                                                'get': 'list'})),
    path(r'offerings/<int:off_pk>/summaries/', views.list_summaries),
    path(r'offerings/<int:off_pk>/summaries/<slug:ex_slug>/', views.list_summaries_for_exercise),
    path('', include(users_router.urls)),
]
