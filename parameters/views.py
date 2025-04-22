from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from .models import ProductionParameters
from .serializers import ProductionParametersSerializer

# Create your views here.

class ProductionParametersViewSet(viewsets.ModelViewSet):
    queryset = ProductionParameters.objects.all()
    serializer_class = ProductionParametersSerializer

def parameters_page(request):
    return render(request, 'parameters.html')
