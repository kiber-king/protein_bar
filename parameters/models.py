from django.db import models

# Create your models here.

class ProductionParameters(models.Model):
    temperature = models.FloatField(verbose_name="Температура")
    humidity = models.FloatField(verbose_name="Влажность")
    pressure = models.FloatField(verbose_name="Давление")
    speed = models.FloatField(verbose_name="Скорость конвейера")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Параметр производства"
        verbose_name_plural = "Параметры производства"
        ordering = ['-timestamp']

    def __str__(self):
        return f"Параметры от {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"
