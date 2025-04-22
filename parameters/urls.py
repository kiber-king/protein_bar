from django.urls import path
from . import views

urlpatterns = [
    path('', views.parameters_page, name='parameters'),
    path('api/parameters/', views.parameters_api, name='parameters_api'),
] 