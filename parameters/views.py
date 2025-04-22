from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from .models import ProductionParameters
from .serializers import ProductionParametersSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import timedelta
import json

# Create your views here.

class ProductionParametersViewSet(viewsets.ModelViewSet):
    queryset = ProductionParameters.objects.all()
    serializer_class = ProductionParametersSerializer

def parameters_page(request):
    return render(request, 'parameters.html')

@csrf_exempt
def parameters_api(request):
    if request.method == 'GET':
        # Получаем данные за последние 24 часа
        last_24h = timezone.now() - timedelta(hours=24)
        parameters = ProductionParameters.objects.filter(timestamp__gte=last_24h)
        
        data = {
            'timestamps': [p.timestamp.isoformat() for p in parameters],
            'temperatures': [p.temperature for p in parameters],
            'humidities': [p.humidity for p in parameters],
            'pressures': [p.pressure for p in parameters],
            'speeds': [p.speed for p in parameters],
        }
        return JsonResponse(data)
        
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            parameter = ProductionParameters.objects.create(
                temperature=float(data['temperature']),
                humidity=float(data['humidity']),
                pressure=float(data['pressure']),
                speed=float(data['speed'])
            )
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
            
    return JsonResponse({'error': 'Method not allowed'}, status=405)
