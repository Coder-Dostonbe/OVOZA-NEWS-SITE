import django_ckeditor_5.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ovoza', '0016_remove_post_video_remove_post_video_url_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='short_description',
            field=django_ckeditor_5.fields.CKEditor5Field(max_length=500),
        ),
        migrations.AlterField(
            model_name='postcontent',
            name='title',
            field=django_ckeditor_5.fields.CKEditor5Field(blank=True, max_length=255),
        ),
    ]