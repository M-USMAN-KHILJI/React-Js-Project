# Generated manually for feedback moderation

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sitecontent', '0002_feedback_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbackentry',
            name='status',
            field=models.CharField(
                choices=[
                    ('Pending', 'Pending'),
                    ('Accepted', 'Accepted'),
                    ('Rejected', 'Rejected'),
                ],
                default='Pending',
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name='feedbackentry',
            name='reviewed_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
