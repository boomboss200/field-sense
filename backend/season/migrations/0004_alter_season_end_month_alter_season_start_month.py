# Generated by Django 4.0.3 on 2023-10-03 13:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('season', '0003_remove_season_year'),
    ]

    operations = [
        migrations.AlterField(
            model_name='season',
            name='end_month',
            field=models.CharField(default='Some string', max_length=100),
        ),
        migrations.AlterField(
            model_name='season',
            name='start_month',
            field=models.CharField(default='Some string', max_length=100),
        ),
    ]
