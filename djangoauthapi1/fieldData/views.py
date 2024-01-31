from rest_framework import generics
from .models import FieldData, Job
from .serializers import FieldDataSerializer ,JobSerializer
from fields.serializers import FieldSerializer
from rest_framework.response import Response
from django.db.models import Subquery
from fields.models import Field
from django.http import JsonResponse
from rest_framework import status
from datetime import datetime


# class FieldDataCreate(generics.CreateAPIView):
#     serializer_class = FieldDataSerializer
class FieldDataCreate(generics.CreateAPIView):
    serializer_class = FieldDataSerializer

    def perform_create(self, serializer):
        # Get the Field instance from the serializer data
        field_instance = serializer.validated_data['field']

        # Check if the 'fieldscoordinates' field is not provided in the request data
        if 'fieldscoordinates' not in serializer.validated_data:
            # Inherit coordinates from the related field
            serializer.validated_data['fieldscoordinates'] = field_instance.coordinates

        # Perform the standard create operation
        super().perform_create(serializer)

class FieldDataListByFarmAndSeason(generics.ListAPIView):
    serializer_class = FieldDataSerializer

    def get_queryset(self):
        farm_id = self.kwargs['farm_id']
        season_id = self.kwargs['season_id']

        # queryset = FieldData.objects.filter(field__farm_id=farm_id, season_id=season_id)
        # return queryset
    
        field_info_subquery = Field.objects.filter(id=Subquery(FieldData.objects.filter(
            field__farm_id=farm_id, season_id=season_id).values('field_id')[:1]))\
            .values('field_name')

        queryset = FieldData.objects.filter(field__farm_id=farm_id, season_id=season_id) \
            .annotate(field_name=Subquery(field_info_subquery.values('field_name')[:1]))
        
        return queryset

# class FieldDataByFieldAndSeason(generics.RetrieveUpdateAPIView):
#     serializer_class = FieldDataSerializer

#     def get_queryset(self):
#         field_id = self.kwargs['field_id']
#         season_id = self.kwargs['season_id']

#         queryset = FieldData.objects.filter(field_id=field_id, season_id=season_id)
#         return queryset

#     def get(self, request, field_id, season_id, *args, **kwargs):
#         try:
#             field_data = self.get_queryset().get(field_id=field_id, season_id=season_id)
#             field_name = field_data.field.field_name
#             field_coordinates = field_data.fieldscoordinates
#             old_coordinates = field_data.field.coordinates

#             field_croptype = field_data.field.crop_type


#             return Response({'field_name': field_name, 'new_coordinates': field_coordinates, 'old_coordinates': old_coordinates, 'crop_type': field_croptype})
#         except FieldData.DoesNotExist:
#             return Response({'error': 'Field data not found for the provided field and season.'})
        
        
#     def update(self, request, field_id, season_id, *args, **kwargs):
#             try:
#                 field_data = self.get_queryset().get(field_id=field_id, season_id=season_id)
#                 field_name = field_data.field.field_name
#                 field_coordinates = field_data.field.coordinates
#                 field_croptype = field_data.field.crop_type

#                     # Assuming you have a field_name parameter in the request data
#                 new_field_coordinates = request.data.get('field_coordinates', field_coordinates)
#                 field_data.coordinates = new_field_coordinates
#                 field_data.save()
                    
#                 return Response({'field_name': field_name, 'coordinates': field_coordinates,  'crop_type': field_croptype, 'fieldData_corindates': new_field_coordinates})
#             except FieldData.DoesNotExist:
#                 return Response({'error': 'Field data not found for the provided field and season.'})
class FieldDataByFieldAndSeason(generics.RetrieveUpdateAPIView):
    serializer_class = FieldDataSerializer

    def get_queryset(self):
        field_id = self.kwargs['field_id']
        season_id = self.kwargs['season_id']

        queryset = FieldData.objects.filter(field_id=field_id, season_id=season_id)
        return queryset

    def get(self, request, field_id, season_id, *args, **kwargs):
        try:
            field_data = self.get_queryset().get(field_id=field_id, season_id=season_id)
            field_name = field_data.field.field_name
            field_coordinates = field_data.fieldscoordinates
            old_coordinates = field_data.field.coordinates
            field_croptype = field_data.field.crop_type
            sowing_date = field_data.sowing_date  # Assuming sowing_date is a field in your model

            return Response({
                'field_name': field_name,
                'new_coordinates': field_coordinates,
                'old_coordinates': old_coordinates,
                'crop_type': field_croptype,
                'sowing_date': sowing_date
            })
        except FieldData.DoesNotExist:
            return Response({'error': 'Field data not found for the provided field and season.'})

    def update(self, request, field_id, season_id, *args, **kwargs):
        try:
            field_data = self.get_queryset().get(field_id=field_id, season_id=season_id)
            field_name = field_data.field.field_name
            field_coordinates = field_data.field.coordinates
            field_croptype = field_data.field.crop_type

            # Assuming you have 'field_coordinates' and 'sowing_date' parameters in the request data
            new_field_coordinates = request.data.get('field_coordinates', field_coordinates)
            new_sowing_date = request.data.get('sowing_date', field_data.sowing_date)
          
            field_data.coordinates = new_field_coordinates
            field_data.sowing_date = new_sowing_date
            field_data.save()

            return Response({
                'field_name': field_name,
                'coordinates': field_coordinates,
                'crop_type': field_croptype,
                'fieldData_coordinates': new_field_coordinates,
                'sowing_date': new_sowing_date
            })
        except FieldData.DoesNotExist:
            return Response({'error': 'Field data not found for the provided field and season.'})

class FieldDataUpdate(generics.RetrieveUpdateAPIView):
    queryset = FieldData.objects.all()
    serializer_class = FieldDataSerializer

class FieldDataDelete(generics.DestroyAPIView):
    queryset = FieldData.objects.all()
    serializer_class = FieldDataSerializer    

def get_field_ids_for_season(request, season_id):
    field_ids = FieldData.objects.filter(season_id=season_id).values_list('field_id', flat=True)
    return JsonResponse({'field_ids': list(field_ids)})

# def get_fieldData_ids_for_season(request, season_id):
#     field_data_ids = FieldData.objects.filter(season_id=season_id).values_list('field_id', flat=True)

#     all_field_ids = Field.objects.values_list('id', flat=True)

#     unmatched_field_ids = list(set(all_field_ids) - set(field_data_ids))

#     return JsonResponse({'unmatched_field_ids': unmatched_field_ids})


# def get_fields_not_in_field_data(request, season_id):
#     # Get the list of field IDs associated with the specified season.
#     field_data_ids = FieldData.objects.filter(season_id=season_id).values_list('field_id', flat=True)

#     # Get the list of all fields from the Field table.
#     fields_not_in_field_data = Field.objects.exclude(id__in=field_data_ids).values('id', 'field_name','crop_type','farm_id')

#     return JsonResponse({'fields_not_in_field_data': list(fields_not_in_field_data)})

class FieldNameUpdateView(generics.UpdateAPIView):
    queryset = Field.objects.all()
    serializer_class = FieldSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.field_name = request.data.get('field_name')
        instance.save()
        return Response({'message': 'Field name updated successfully'}, status=status.HTTP_200_OK)
    
class JobCreateView(generics.CreateAPIView):
    serializer_class = JobSerializer

    def perform_create(self, serializer):
        field_id = self.kwargs.get('fielddata_id')
        field = FieldData.objects.get(id=field_id)
        job = serializer.save()
        field.jobs.add(job)



class FieldsNotInFieldData(generics.ListAPIView):
    serializer_class = FieldDataSerializer

    def list(self, request, season_id):
        # Get the list of field IDs associated with the specified season.
        field_data_ids = FieldData.objects.filter(season_id=season_id).values_list('field_id', flat=True)

        # Get the list of all fields from the Field table that are not in field_data_ids.
        fields_not_in_field_data = Field.objects.exclude(id__in=field_data_ids).values('id', 'field_name', 'crop_type', 'farm_id')

        # Extract the field data as a list
        field_data_list = list(fields_not_in_field_data)

        return Response(field_data_list)


class FieldDataJobsView(generics.ListAPIView):
    serializer_class = JobSerializer

    def get_queryset(self):
        field_data_id = self.kwargs['fielddata_id']

        try:
            field_data = FieldData.objects.get(id=field_data_id)
            return field_data.jobs.all()  # Retrieve all jobs associated with the FieldData
        except FieldData.DoesNotExist:
            return Job.objects.none()  # Return an empty queryset if FieldData does not exist

    def list(self, request, fielddata_id):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    

class IncompleteJobsView(generics.ListAPIView):
    serializer_class = JobSerializer

    def get_queryset(self):
        return Job.objects.filter(job_complete=False)

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)    
    
    

class FieldDataIncompleteJobsView(generics.ListAPIView):
    serializer_class = JobSerializer

    def get_queryset(self):
        fielddata_id = self.kwargs['fielddata_id']

        try:
            field_data = FieldData.objects.get(id=fielddata_id)
            return field_data.jobs.filter(job_complete=False)  # Retrieve incomplete jobs associated with the FieldData
        except FieldData.DoesNotExist:
            return Job.objects.none()  # Return an empty queryset if FieldData does not exist

    def list(self, request, fielddata_id):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

class FieldDataCompletedJobsView(generics.ListAPIView):
    serializer_class = JobSerializer

    def get_queryset(self):
        fielddata_id = self.kwargs['fielddata_id']

        try:
            field_data = FieldData.objects.get(id=fielddata_id)
            return field_data.jobs.filter(job_complete=True)  # Retrieve completed jobs associated with the FieldData
        except FieldData.DoesNotExist:
            return Job.objects.none()  # Return an empty queryset if FieldData does not exist

    def list(self, request, fielddata_id):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
class JobCompleteUpdateView(generics.UpdateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def update(self, request, *args, **kwargs):
        try:
            job_instance = self.get_object()
            job_instance.job_complete = True
            job_instance.save()
            
            serializer = self.get_serializer(job_instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)