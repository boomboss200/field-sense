from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from farms.models import Farm
from season.models import Season

class Field(models.Model):
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE)
    field_name = models.CharField(max_length=100)
    crop_type = models.CharField(max_length=100)
    coordinates = models.TextField()
    # season = models.ForeignKey(Season, on_delete=models.CASCADE,default=None, blank=True, null=True)
    # acreage = models.DecimalField(max_digits=5, decimal_places=2)
    # Add more fields as needed

    def __str__(self):
        return self.field_name