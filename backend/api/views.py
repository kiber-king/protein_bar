from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
import random
import time
from .models import ProductionParameters
from .serializers import ProductionParametersSerializer

class ProductionParametersViewSet(viewsets.ModelViewSet):
    queryset = ProductionParameters.objects.all()
    serializer_class = ProductionParametersSerializer

    def generate_random_deviation(self, base_value):
        deviation = random.uniform(-0.1, 0.1)  # ±10% отклонение
        return base_value * (1 + deviation)

    @action(detail=False, methods=['get'])
    def latest(self, request):
        latest = self.get_queryset().first()
        if latest:
            serializer = self.get_serializer(latest)
            return Response(serializer.data)
        return Response({})

    @action(detail=False, methods=['get'])
    def history(self, request):
        hours = int(request.query_params.get('hours', 24))
        since = timezone.now() - timedelta(hours=hours)
        queryset = self.get_queryset().filter(
            timestamp__gte=since,
            is_target=False  # Только измеренные значения
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def target(self, request):
        target = self.get_queryset().filter(is_target=True).first()
        if target:
            serializer = self.get_serializer(target)
            return Response(serializer.data)
        return Response({})

    @action(detail=False, methods=['get'])
    def stream(self, request):
        """
        Генерирует новые параметры на основе последних значений с небольшими отклонениями
        """
        latest = self.get_queryset().first()
        if latest:
            new_params = ProductionParameters.objects.create(
                temperature=self.generate_random_deviation(latest.temperature),
                humidity=self.generate_random_deviation(latest.humidity),
                pressure=self.generate_random_deviation(latest.pressure),
                speed=self.generate_random_deviation(latest.speed)
            )
            serializer = self.get_serializer(new_params)
            return Response(serializer.data)
        return Response({}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request, *args, **kwargs):
        is_target = request.data.get('is_target', False)
        serializer = self.get_serializer(data={**request.data, 'is_target': is_target})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 