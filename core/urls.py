from django.urls import include, path, re_path
from rest_framework import routers
from core import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)

urlpatterns = [ 
    path(r'offerings/<int:off_pk>/exercises/', views.ExerciseViewSet.as_view({'post': 'create',
                                                                                'get': 'list'})),
    path(r'offerings/<int:off_pk>/exercises/<slug:ex_slug>/answers/', views.ExerciseViewSet.as_view({'post': 'answer'})),
    path('', include(router.urls)),
]
