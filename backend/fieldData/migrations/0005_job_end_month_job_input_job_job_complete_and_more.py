# Generated by Django 4.0.3 on 2023-10-25 17:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fieldData', '0004_job_remove_fielddata_job_fielddata_jobs'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='end_month',
            field=models.CharField(default='Some string', max_length=200),
        ),
        migrations.AddField(
            model_name='job',
            name='input',
            field=models.CharField(default='Some string', max_length=200),
        ),
        migrations.AddField(
            model_name='job',
            name='job_complete',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='job',
            name='start_month',
            field=models.CharField(default='Some string', max_length=200),
        ),
    ]
