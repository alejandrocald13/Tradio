from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('wallet', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='wallet',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, default='2025-10-19T00:00:00'),
        ),
    ]
