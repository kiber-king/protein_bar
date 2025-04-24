from rest_framework import serializers
from .models import ProductionParameters

class ProductionParametersSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionParameters
        fields = ['id', 'temperature', 'humidity', 'pressure', 'speed', 'timestamp', 'is_target']
        read_only_fields = ['id', 'timestamp'] 