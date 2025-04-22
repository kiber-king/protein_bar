from rest_framework import serializers
from .models import ProductionParameters

class ProductionParametersSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionParameters
        fields = '__all__' 