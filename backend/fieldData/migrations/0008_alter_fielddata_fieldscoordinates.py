# Generated by Django 4.0.3 on 2024-01-14 21:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fieldData', '0007_fielddata_sowing_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fielddata',
            name='fieldscoordinates',
            field=models.TextField(),
        ),
    ]
