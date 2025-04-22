from django.db import models

# Create your models here.

class ProductionParameters(models.Model):
    temperature = models.FloatField(verbose_name='Температура')
    humidity = models.FloatField(verbose_name='Влажность')
    pressure = models.FloatField(verbose_name='Давление')
    mixing_speed = models.FloatField(verbose_name='Скорость перемешивания')
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Время измерения')

    class Meta:
        verbose_name = 'Параметры производства'
        verbose_name_plural = 'Параметры производства'
        ordering = ['-timestamp']

    def __str__(self):
        return f'Параметры от {self.timestamp}'
