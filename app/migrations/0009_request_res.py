# Generated by Django 2.2.13 on 2020-12-19 20:45

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('app', '0008_resource_times_visited'),
    ]

    operations = [
        migrations.CreateModel(
            name='Request_res',
            fields=[
                ('ReqNo', models.AutoField(primary_key=True, serialize=False)),
                ('RDes', models.CharField(max_length=200)),
                ('Userno', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
