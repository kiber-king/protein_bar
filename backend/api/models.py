from django.db import models

class ProductionParameters(models.Model):
    temperature = models.FloatField()
    humidity = models.FloatField()
    pressure = models.FloatField()
    speed = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_target = models.BooleanField(default=False)  # True для целевых значений, False для измеренных

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f'Параметры от {self.timestamp}' 