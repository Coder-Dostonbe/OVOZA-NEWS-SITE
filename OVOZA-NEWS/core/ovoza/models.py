from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.timesince import timesince
from django.utils.timezone import now

class AuthUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('author', 'Author'),
        ('user', 'User'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='author')
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)






class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Post(models.Model):
    title = models.TextField(max_length=250)
    slug = models.SlugField(unique=True)

    short_description = models.TextField(max_length=500)

    image = models.ImageField(upload_to="posts/")
    source = models.CharField(max_length=100, blank=True)

    author = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name="posts")

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True
    )

    tags = models.ManyToManyField(Tag, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    share = models.PositiveIntegerField(default=0)

    is_published = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)

    views = models.PositiveIntegerField(default=0)

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

    CONTENT_TYPES = [
        (TEXT, "Text"),
        (TITLE, "Title"),
        (IMAGE, "Image"),
        (QUOTE, "Quote"),
        (STAT, "Stat"),
        (INFO, "Info Box"),
    ]

    post = models.ForeignKey(
        'Post',
        on_delete=models.CASCADE,
        related_name="blocks"
    )

    type = models.CharField(max_length=10, choices=CONTENT_TYPES)

    # 🔹 universal fieldlar
    title = models.CharField(max_length=255, blank=True)
    text = models.TextField(blank=True)
    value = models.CharField(max_length=100, blank=True)

    image = models.ImageField(upload_to="post_blocks/", blank=True)
    level = models.IntegerField(default=2)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

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


# models.py
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
    image = models.ImageField(upload_to='ads/', blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Reklama'
        verbose_name_plural = 'Reklamalar'
