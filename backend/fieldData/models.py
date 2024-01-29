from django.db import models
from fields.models import Field
from season.models import Season

class Job(models.Model):
    job_type = models.CharField(max_length=100)
    input = models.CharField(max_length=200,default='Some string')
    start_month = models.CharField(max_length=200,default='Some string')
    end_month = models.CharField(max_length=200,default='Some string')
    job_complete = models.BooleanField(default=False)
    
    #job due state and start date 
    #input form 


class FieldData(models.Model):
    field = models.ForeignKey(Field, on_delete=models.CASCADE)
    season = models.ForeignKey(Season, on_delete=models.CASCADE)
    jobs = models.ManyToManyField(Job, blank=True, related_name='fields')
    #job id will be sent as foriegn key later on
    #coordinates feilds will be created that will take the value from the fields.coordinates so that it can later on be updated and not lost for each season
    fieldscoordinates = models.TextField(default='Some string')
    crop_type = models.CharField(null=True, blank=True ,max_length=100)
    sowing_date = models.CharField(max_length=200,default='Some string')
   


    def create_jobs(self, job_data):
        # Create Job objects and associate them with the Field
        for job_info in job_data:
            job = Job.objects.create(**job_info)
            self.jobs.add(job)
   


    class Meta:
        unique_together = ('field', 'season')