
from django.urls import path
from . import views
from .views import farm_length, field_length,farms_with_fields,FarmDeleteView

app_name = 'farms'

urlpatterns = [
    path('add/', views.add_farm, name='add_farms'),
    path('my-farms/', views.my_farms, name='my_farms'),
    path('farm-length/', farm_length, name='farm_length'),
    path('field-length/', field_length, name='field_length'),
    path('farms-with-fields/', farms_with_fields, name='farms_with_fields'),
    path('farm/<int:pk>/delete/', FarmDeleteView.as_view(), name='farm-delete'),
    path('farm/<int:farm_id>/', views.farm_details, name='farm_details'),
    path('all-farms/', views.all_farms, name='all_farms'),


    # Add more URLs as needed
]
