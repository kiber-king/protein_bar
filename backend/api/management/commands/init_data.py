from django.core.management.base import BaseCommand
from api.models import ProductionParameters
from django.utils import timezone
from datetime import timedelta
import random

class Command(BaseCommand):
    help = 'Инициализирует начальные данные для параметров производства'

    def handle(self, *args, **options):
        # Удаляем все существующие данные
        ProductionParameters.objects.all().delete()

        # Создаем начальные данные за последние 24 часа
        now = timezone.now()
        base_values = {
            'temperature': 25.0,
            'humidity': 60.0,
            'pressure': 1013.0,
            'speed': 100.0
        }

        for i in range(24):
            timestamp = now - timedelta(hours=i)
            params = ProductionParameters.objects.create(
                temperature=base_values['temperature'] + random.uniform(-2, 2),
                humidity=base_values['humidity'] + random.uniform(-5, 5),
                pressure=base_values['pressure'] + random.uniform(-10, 10),
                speed=base_values['speed'] + random.uniform(-5, 5),
                timestamp=timestamp
            )
            self.stdout.write(
                self.style.SUCCESS(f'Создан параметр: {params}')
            ) 