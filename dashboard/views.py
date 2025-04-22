from django.shortcuts import render
from django.db.models import Avg
from parameters.models import ProductionParameters

def dashboard(request):
    # Получаем последние параметры
    latest_params = ProductionParameters.objects.first()
    
    # Если параметров еще нет, используем значения по умолчанию
    current_temperature = latest_params.temperature if latest_params else 0
    current_humidity = latest_params.humidity if latest_params else 0
    current_pressure = latest_params.pressure if latest_params else 0
    current_speed = latest_params.speed if latest_params else 0

    context = {
        'current_temperature': current_temperature,
        'current_humidity': current_humidity,
        'current_pressure': current_pressure,
        'current_speed': current_speed,
    }
    
    return render(request, 'dashboard.html', context)
