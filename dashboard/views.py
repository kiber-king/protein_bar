from django.shortcuts import render
from parameters.models import ProductionParameters
from django.db.models import Avg
from django.utils import timezone
from datetime import timedelta

def dashboard(request):
    # Получаем данные за последние 24 часа
    last_24h = timezone.now() - timedelta(hours=24)
    parameters = ProductionParameters.objects.filter(timestamp__gte=last_24h)
    
    # Рассчитываем средние значения
    avg_values = parameters.aggregate(
        avg_temperature=Avg('temperature'),
        avg_humidity=Avg('humidity'),
        avg_pressure=Avg('pressure'),
        avg_mixing_speed=Avg('mixing_speed')
    )
    
    context = {
        'parameters': parameters,
        'avg_values': avg_values,
    }
    return render(request, 'dashboard.html', context)
