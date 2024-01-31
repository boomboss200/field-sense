from rest_framework import serializers
from .models import FieldData, Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'job_type', 'end_month', 'start_month', 'job_complete', 'input']

class FieldDataSerializer(serializers.ModelSerializer):
    field_name = serializers.CharField(source='field.field_name', read_only=True)
    # crop_type = serializers.CharField(source='field.crop_type', read_only=True)
    jobs = JobSerializer(many=True, read_only=True)

    class Meta:
        model = FieldData
        fields = ['id', 'field', 'season','jobs','fieldscoordinates','crop_type','field_name','sowing_date']