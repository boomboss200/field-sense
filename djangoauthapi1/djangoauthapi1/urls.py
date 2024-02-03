from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/farm/',include('farms.urls')),
    path('farms/', include('farms.urls')),
    path('api/user/', include('account.urls')),
    path('fields/', include('fields.urls')),
    path('vegetation/', include('vegetation.urls')),
    path('data/', include('fieldData.urls')),
    path('season/', include('season.urls')),
    path('modelsML/', include('modelsML.urls')),
    

]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

