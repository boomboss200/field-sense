
from django.urls import path
from . import views
from .views import FieldDeleteView

app_name = 'fields'

urlpatterns = [
    path('add-field/<int:farm_id>/', views.create_field, name='add_field'),
    path('my-fields/<int:farm_id>/', views.get_fields_for_farm, name='my_fields'),
    path('my-fields/', views.get_fields, name='my_fields'),
    path('field/<int:pk>/delete/', FieldDeleteView.as_view(), name='field_delete'),
    path('addfield/<int:farm_id>/', views.create_fieldskml, name='kml_field'),
    # Add more URLs as needed
]