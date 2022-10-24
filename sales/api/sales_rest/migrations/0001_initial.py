# Generated by Django 4.0.3 on 2022-10-24 21:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AutomobileVO',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('color', models.CharField(max_length=50)),
                ('year', models.PositiveSmallIntegerField()),
                ('vin', models.CharField(max_length=17, unique=True)),
                ('model_id', models.PositiveSmallIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('address', models.CharField(max_length=2000)),
                ('phone_number', models.PositiveSmallIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='SalesPerson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('employee_number', models.PositiveSmallIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Sale',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.PositiveSmallIntegerField()),
                ('automobile', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='sales', to='sales_rest.automobilevo')),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='sales', to='sales_rest.customer')),
                ('sales_person', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='sales', to='sales_rest.salesperson')),
            ],
        ),
    ]