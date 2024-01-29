from django.urls import path
from . import views
app_name = 'vegetation'

urlpatterns = [
    path('pointwise/', views.point_wise_ndvi),
    path('average/', views.average_ndvi),    
]