# Generated by Django 3.2.6 on 2021-10-02 00:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_auto_20210903_1838'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='password_email_sent',
            field=models.BooleanField(default=False),
        ),
    ]