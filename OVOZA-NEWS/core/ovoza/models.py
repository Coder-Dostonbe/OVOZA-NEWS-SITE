from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.timesince import timesince
from django.utils.timezone import now
from slugify import slugify
from django_ckeditor_5.fields import CKEditor5Field

import uuid

class AuthUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('author', 'Author'),
        ('user', 'User'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='author')
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    bio = models.TextField(blank=True)


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    icon = models.CharField(max_length=100, default='fas fa-folder')
    color = models.CharField(max_length=7, default='#1a6fa8')


    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Post(models.Model):
    title = models.TextField(max_length=250)
    slug = models.SlugField(unique=True, blank=True)

    short_description = CKEditor5Field(max_length=1000)

    image = models.ImageField(upload_to="posts/")
    source = models.CharField(max_length=100, blank=True)

    author = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name="posts")

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True
    )

    tags = models.ManyToManyField(Tag, blank=True)

    LANGUAGE_CHOICES = [
        ('uz', "O'zbek (Lotin)"),
        ('uz-cyrl', "Ўзбек (Кирил)"),
        ('ru', 'Русский'),
        ('en', 'English'),
    ]
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='uz')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    share = models.PositiveIntegerField(default=0)

    is_published = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)

    views = models.PositiveIntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            if not base_slug:
                base_slug = str(uuid.uuid4())[:8]
            slug = base_slug
            counter = 1
            while Post.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def time_since(self):
        diff = now() - self.created_at

        seconds = diff.total_seconds()

        if seconds < 60:
            return 'Hozirgina'
        elif seconds < 3600:
            minutes = int(seconds // 60)
            return f'{minutes} daqiqa oldin'
        elif seconds < 86400:
            hours = int(seconds // 3600)
            return f'{hours} soat oldin'
        elif seconds < 2592000:
            days = int(seconds // 86400)
            return f'{days} kun oldin'
        elif seconds < 31536000:
            months = int(seconds // 2592000)
            return f'{months} oy oldin'
        else:
            years = int(seconds // 31536000)
            return f'{years} yil oldin'

    def __str__(self):
        return self.title


class PostContent(models.Model):
    TEXT = "text"
    TITLE = "title"
    IMAGE = "image"
    QUOTE = "quote"
    STAT = "stat"
    INFO = "info"
    VIDEO = "video"

    CONTENT_TYPES = [
        (TEXT, "Text"),
        (TITLE, "Title"),
        (IMAGE, "Image"),
        (QUOTE, "Quote"),
        (STAT, "Stat"),
        (INFO, "Info Box"),
        (VIDEO, "Video"),
    ]

    post = models.ForeignKey(
        'Post',
        on_delete=models.CASCADE,
        related_name="blocks"
    )

    type = models.CharField(max_length=10, choices=CONTENT_TYPES)



    title = models.CharField(max_length=255, blank=True)
    text = CKEditor5Field(blank=True)
    value = models.CharField(max_length=100, blank=True)

    video = models.FileField(upload_to="post_videos/", blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)

    image = models.ImageField(upload_to="post_blocks/", blank=True)
    level = models.IntegerField(default=2)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def save(self, *args, **kwargs):
        if self.video_url:
            url = self.video_url
            if 'youtube.com/watch' in url or 'm.youtube.com' in url:
                video_id = url.split('v=')[-1].split('&')[0]
                self.video_url = f'https://www.youtube.com/embed/{video_id}'
            elif 'youtu.be/' in url:
                video_id = url.split('youtu.be/')[-1].split('?')[0]
                self.video_url = f'https://www.youtube.com/embed/{video_id}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.post.title} - {self.type}"


class PostGallery(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="gallery"
    )

    image = models.ImageField(upload_to="post_gallery/")

    def __str__(self):
        return f"Gallery image for {self.post.title}"


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name='comments')
    message = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.post}"


class PostView(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_views')
    ip = models.GenericIPAddressField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'ip')

class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name='likes', null=True, blank=True)
    ip = models.GenericIPAddressField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')

class Advertisement(models.Model):
    title = models.CharField(max_length=200)
    video = models.FileField(upload_to='ads/', blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='ads/', blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Reklama'
        verbose_name_plural = 'Reklamalar'

class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = 'Obunachi'
        verbose_name_plural = 'Obunachilar'


class TelegramSettings(models.Model):
    channel_id = models.CharField(
        max_length=100,
        help_text="Faqat username formatida: @OvozaNewsPage — t.me/... emas!"
    )
    send_title       = models.BooleanField(default=True,  verbose_name="Sarlavha")
    send_image       = models.BooleanField(default=True,  verbose_name="Rasm")
    send_description = models.BooleanField(default=True,  verbose_name="Qisqacha matn")
    send_category    = models.BooleanField(default=True,  verbose_name="Kategoriya")
    send_author      = models.BooleanField(default=False, verbose_name="Muallif")
    send_link        = models.BooleanField(default=True,  verbose_name="Havola")
    is_active        = models.BooleanField(default=True,  verbose_name="Faol")

    def save(self, *args, **kwargs):
        # t.me/kanal → @kanal avtomatik tuzatish
        cid = self.channel_id.strip()
        if cid.startswith('https://t.me/'):
            cid = '@' + cid.split('t.me/')[-1].rstrip('/')
        elif cid.startswith('t.me/'):
            cid = '@' + cid.split('t.me/')[-1].rstrip('/')
        elif not cid.startswith('@') and not cid.startswith('-'):
            cid = '@' + cid
        self.channel_id = cid
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Telegram → {self.channel_id}"

    class Meta:
        verbose_name = 'Telegram sozlamalari'
        verbose_name_plural = 'Telegram sozlamalari'


class ContactMessage(models.Model):
    SUBJECT_CHOICES = [
        ('umumiy', 'Umumiy savol'),
        ('hamkorlik', 'Hamkorlik'),
        ('reklama', 'Reklama'),
        ('xato', 'Xato bildirish'),
        ('boshqa', 'Boshqa'),
    ]
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default='umumiy')
    message = models.TextField()
    extra_info = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} – {self.get_subject_display()}"

    class Meta:
        verbose_name = 'Murojaat'
        verbose_name_plural = 'Murojaatlar'
        ordering = ['-created_at']