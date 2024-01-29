# urls.py

from django.urls import path
from .views import FieldDataCreate, JobCompleteUpdateView, FieldDataListByFarmAndSeason, FieldDataByFieldAndSeason,FieldDataJobsView,FieldDataCompletedJobsView,FieldDataIncompleteJobsView, FieldDataUpdate, FieldDataDelete, FieldsNotInFieldData, JobCreateView,FieldNameUpdateView,IncompleteJobsView
from . import views

urlpatterns = [
    path('field-data/', FieldDataCreate.as_view(), name='field-data-create'),
    path('field-data/<int:farm_id>/<int:season_id>/', FieldDataListByFarmAndSeason.as_view(), name='field-data-list-by-farm-and-season'),
    path('field-tabledata-/<int:field_id>/<int:season_id>/', FieldDataByFieldAndSeason.as_view(), name='field-data-by-field-and-season'),
    path('field-data/<int:pk>/update/', FieldDataUpdate.as_view(), name='field-data-update'),
    path('field-data-delete/<int:pk>/', FieldDataDelete.as_view(), name='field-data-delete'),
    path('field-data_unmatched_field_ids/<int:season_id>/',FieldsNotInFieldData.as_view(), name='get_fieldData_ids_for_season'),
    path('field-data_season_field_ids/<int:season_id>/', views.get_field_ids_for_season, name='get_field_ids_for_season'),
    path('update-field-name/<int:pk>/', FieldNameUpdateView.as_view(), name='update_field_name'),
    path('fields/<int:fielddata_id>/jobs/', JobCreateView.as_view(), name='job-create'),
    path('field-data/<int:fielddata_id>/jobs/', FieldDataJobsView.as_view(), name='fielddata-jobs'),
    path('fields/<int:fielddata_id>/incomplete-jobs/', FieldDataIncompleteJobsView.as_view(), name='fielddata-incomplete-jobs'),
    path('fields/<int:fielddata_id>/complete-jobs/', FieldDataCompletedJobsView.as_view(), name='fielddata-completed-jobs'),
    path('fields/incomplete-jobs/', IncompleteJobsView.as_view(), name='incomplete-jobs'),
    path('update-job-complete/<int:pk>/', JobCompleteUpdateView.as_view(), name='update-job-complete'),

]
