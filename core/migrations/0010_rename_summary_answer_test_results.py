# Generated by Django 3.2.6 on 2021-10-06 20:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_merge_20211004_1544'),
    ]

    operations = [
        migrations.RenameField(
            model_name='answer',
            old_name='summary',
            new_name='test_results',
        ),
    ]