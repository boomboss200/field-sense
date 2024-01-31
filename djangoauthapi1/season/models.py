from django.db import models
from django.conf import settings
from django.contrib.auth.models import User



# Create your models here.


class Season(models.Model):
    User = settings.AUTH_USER_MODEL

    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)  # Set a default user ID

    name = models.CharField(max_length=100)
    start_month = models.CharField(max_length=200,default='Some string')
    end_month = models.CharField(max_length=200,default='Some string')

    def __str__(self):
        return self.name
