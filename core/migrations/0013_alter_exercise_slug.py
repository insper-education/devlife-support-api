# Generated by Django 3.2.6 on 2021-11-16 13:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_alter_course_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='exercise',
            name='slug',
            field=models.SlugField(max_length=255),
        ),
    ]
