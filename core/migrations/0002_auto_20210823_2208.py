# Generated by Django 3.2.6 on 2021-08-23 22:08

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='course',
            old_name='nome',
            new_name='name',
        ),
        migrations.RemoveField(
            model_name='answer',
            name='student',
        ),
        migrations.AddField(
            model_name='answer',
            name='user',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='core.user'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='answer',
            name='submission_date',
            field=models.DateTimeField(default=datetime.date.today),
        ),
    ]
