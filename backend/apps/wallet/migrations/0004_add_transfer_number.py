from django.db import migrations, models
import uuid

class Migration(migrations.Migration):

    dependencies = [
        ('wallet', '0002_auto_20251019_0843'),
    ]

    operations = [
        migrations.AddField(
            model_name='movement',
            name='transfer_number',
            field=models.CharField(max_length=100, unique=True, null=True, blank=True),
        ),
        migrations.RunPython(
            code=lambda apps, schema_editor: fill_transfer_number(apps, schema_editor),
            reverse_code=migrations.RunPython.noop
        ),
    ]

def fill_transfer_number(apps, schema_editor):
    Movement = apps.get_model('wallet', 'Movement')
    for m in Movement.objects.all():
        if not m.transfer_number:
            m.transfer_number = f"TRF-{uuid.uuid4().hex[:8].upper()}"
            m.save()
