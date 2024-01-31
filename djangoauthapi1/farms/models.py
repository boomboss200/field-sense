from django.db import models
from django.conf import settings
from django.contrib.auth.models import User



# Create your models here.


class Farm(models.Model):
    User = settings.AUTH_USER_MODEL

    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)  # Set a default user ID

    name = models.CharField(max_length=100)
    # owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    longitude = models.CharField(max_length=255)
    latitude = models.CharField(max_length=255)


    def __str__(self):
        return self.name

