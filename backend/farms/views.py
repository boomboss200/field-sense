from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from farms.models import Farm
from farms.serializers import FarmSerializer,FarmSerializer2
from fields.models import Field
from fields.serializers import FieldSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_farm(request):
    if request.method == 'POST':
        serializer = FarmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_farms(request):
    queryset = Farm.objects.filter(user = request.user.id)
    farms = Farm.objects.filter(user=request.user)
    serializer = FarmSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def farm_length(request):
    farms_count = Farm.objects.count()
    return Response({'farms_count': farms_count})

@api_view(['GET'])
def field_length(request):
    fields_count = Field.objects.count()
    return Response({'fields_count': fields_count})

# @api_view(['GET'])
# def farms_with_fields1(request):
#     farms = Farm.objects.all()
#     farms_data = []

#     for farm in farms:
#         fields_count = Field.objects.filter(farm=farm).count()
#         farms_data.append({
#             'farm_name': farm.name,
#             'fields_count': fields_count,
#         })

#     return Response({'farms_data': farms_data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def farms_with_fields(request):
    user = request.user

    farms = Farm.objects.filter(user=user)
    farms_data = []

    for farm in farms:
        fields_count = Field.objects.filter(farm=farm).count()
        farms_data.append({
            'farm_name': farm.name,
            'fields_count': fields_count,
        })

    return Response({'farms_data': farms_data})

from django.views import View
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

class FarmDeleteView(View):
    def get(self, request, pk):
        farm = get_object_or_404(Farm, pk=pk)
        farm.delete()

        # Serialize the deleted farm and return as JSON response
        serializer = FarmSerializer(farm)
        return JsonResponse({'message': 'Farm deleted successfully', 'farm': serializer.data})
    

def farm_details(request, farm_id):
    try:
        farm = Farm.objects.get(id=farm_id)
        fields_count = Field.objects.filter(farm=farm).count()

        farm_data = {
            'farm_id': farm.id,
            'farm_name': farm.name,  # Replace 'farm_name' with the actual field name in your Farm model
            'fields_count': fields_count,
            # Add more farm details as needed
        }

        return JsonResponse({'farm_details': farm_data})

    except Farm.DoesNotExist:
        return JsonResponse({'error': 'Farm not found'}, status=404)

@api_view(['GET'])
def all_farms(request):
    # Assuming Farm model has a ForeignKey named 'user' pointing to the User model.
    user = request.user

    # Retrieve farms associated with the current user.
    user_farms = Farm.objects.filter(user=user)

    farms_data = []

    for farm in user_farms:
        fields_count = Field.objects.filter(farm=farm).count()

        farm_data = {
            'farm_id': farm.id,
            'farm_name': farm.name,
            'fields_count': fields_count,
            # Add more farm details as needed
        }

        farms_data.append(farm_data)

    serializer = FarmSerializer2(farms_data, many=True)
    return Response(serializer.data)