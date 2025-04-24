from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductionParametersViewSet

router = DefaultRouter()
router.register(r'parameters', ProductionParametersViewSet, basename='parameters')

urlpatterns = [
    path('', include(router.urls)),
] 