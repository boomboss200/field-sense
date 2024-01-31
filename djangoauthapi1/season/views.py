

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from season.models import Season
from season.serializers import SeasonSerializer
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views import View
from rest_framework import generics
from rest_framework import status


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_season(request):
    if request.method == 'POST':
        serializer = SeasonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_seasons(request):
    queryset = Season.objects.filter(user = request.user.id)
    seasons = Season.objects.filter(user=request.user)
    serializer = SeasonSerializer(queryset, many=True)
    return Response(serializer.data)

class SeasonDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Season.objects.all()
    serializer_class = SeasonSerializer

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Season deleted successfully"}, status=status.HTTP_204_NO_CONTENT)