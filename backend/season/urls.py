
from django.urls import path
from . import views
from .views import SeasonDetailView

app_name = 'season'

urlpatterns = [
    path('add_season/', views.add_season, name='add_season'),
    path('my-seasons/', views.my_seasons, name='my_seasons'),
    path('seasons/delete/<int:pk>/', SeasonDetailView.as_view(), name='delete_season'),

    # Add more URLs as needed
]
