

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from fields.models import Field
from fields.serializers import FieldSerializer
from farms.models import Farm
from rest_framework import viewsets, status
from django.views.decorators.csrf import csrf_exempt
from farms.serializers import FarmSerializer
from django.http import Http404
from season.models import Season
from season.serializers import SeasonSerializer
import json

@api_view(['POST'])
def add_field(request):
    if request.method == 'POST':
        serializer = FieldSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(farm=request.farm)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

@api_view(['GET'])
def my_fields(request):
    queryset = Field.objects.filter(farm = request.farm.id)
    farms = Field.objects.filter(farm=request.farm)
    serializer = FieldSerializer(queryset, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_field(request, farm_id):
    if request.method == 'POST':
        try:
            farm = Farm.objects.get(pk=farm_id)
        except Farm.DoesNotExist:
            return Response({'error': 'Farm not found'}, status=status.HTTP_404_NOT_FOUND)   
        serializer = FieldSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(farm=farm)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_fields_for_farm(request, farm_id):
    try:
        farm = Farm.objects.get(pk=farm_id)
    except Farm.DoesNotExist:
        raise Http404("Farm does not exist")

    fields = Field.objects.filter(farm=farm)
    serializer = FieldSerializer(fields, many=True)
    
    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_fieldskml(request, farm_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        farm_id = data['farm_id']
        coordinates_array = data['polygons']
        crop_type ='Change it'
        try:
            farm = Farm.objects.get(pk=farm_id)
        except Farm.DoesNotExist:
            return Response({'error': 'Farm not found'}, status=status.HTTP_404_NOT_FOUND)
        fields_data = []
        # for index, coordinates in enumerate(coordinates_array, start=1):
        #     field_data = {
        #         'farm': farm_id,
        #         'field_name': f'{farm_id}A{index}',  # You can customize this as needed
        #         'crop_type': crop_type,
        #         'coordinates': coordinates
        #     }
        #     fields_data.append(field_data)
        for index, (key, coordinates_array) in enumerate(coordinates_array.items(), start=1):
            # Convert the coordinates_array to a JSON-formatted string
            coordinates_string = json.dumps(coordinates_array)

            # Use the coordinates_string in your code
            field_data = {
                'farm': farm_id,
                'field_name': f'{farm_id}A{index}',  # You can customize this as needed
                'crop_type': crop_type,
                'coordinates': coordinates_string,
            }

            fields_data.append(field_data)

        print(fields_data)
        serializer = FieldSerializer(data=fields_data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Serializer Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_fields(request):
    try:
        user = request.user
    except user.DoesNotExist:
        raise Http404("User does not exist")

    # Get all farms associated with the user
    farms = Farm.objects.filter(user=request.user.id)

    # Retrieve fields associated with all farms
    fields = Field.objects.filter(farm__in=farms)

    serializer = FieldSerializer(fields, many=True)
    
    return Response(serializer.data)

from django.shortcuts import get_object_or_404
from django.views import View
from django.http import HttpResponse


class FieldDeleteView(View):
    def get(self, request, pk):
        field = get_object_or_404(Field, pk=pk)
        farm_pk = field.farm.pk
        field.delete()
        return HttpResponse(f"Field '{field.field_name}' is deleted for farm '{field.farm}'")
