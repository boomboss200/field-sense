from django.urls import path
from . import views
app_name = 'modelsML'

urlpatterns = [
    path('classifyc/', views.Classify_view),
    path('harvestdate/', views.HarvestDate_view),    
     path('fertilizerd/', views.Fertilizer_view),

]