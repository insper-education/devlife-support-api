# Generated by Django 3.2.6 on 2021-08-31 16:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_auto_20210831_1622'),
    ]

    operations = [
        migrations.RenameField(
            model_name='useranswersummary',
            old_name='count',
            new_name='answer_count',
        ),
    ]
