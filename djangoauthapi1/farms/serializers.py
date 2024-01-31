from rest_framework import serializers
from farms.models import Farm

class FarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farm
        fields = '__all__'


class FarmSerializer2(serializers.Serializer):
    farm_id = serializers.IntegerField()
    farm_name = serializers.CharField()
    fields_count = serializers.IntegerField()
