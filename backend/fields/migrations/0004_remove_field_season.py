# Generated by Django 4.0.3 on 2023-10-03 15:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fields', '0003_alter_field_season'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='field',
            name='season',
        ),
    ]
