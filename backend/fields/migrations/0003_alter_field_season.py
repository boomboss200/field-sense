# Generated by Django 4.0.3 on 2023-09-26 13:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('season', '0001_initial'),
        ('fields', '0002_field_season'),
    ]

    operations = [
        migrations.AlterField(
            model_name='field',
            name='season',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='season.season'),
        ),
    ]
