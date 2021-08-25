from django.urls import re_path
from django.views.generic.base import TemplateView

urlpatterns = [
    re_path('.*', TemplateView.as_view(template_name='frontend-dev/build/index.html')),
]
