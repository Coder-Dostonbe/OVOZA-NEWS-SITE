from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.core.mail import send_mass_mail, send_mail
from django.conf import settings
from .models import Post, Subscriber

_was_published = {}

@receiver(pre_save, sender=Post)
def track_published(sender, instance, **kwargs):
    if instance.pk:
        try:
            old = Post.objects.get(pk=instance.pk)
            _was_published[instance.pk] = old.is_published
        except Post.DoesNotExist:
            _was_published[instance.pk] = False
    else:
        _was_published[instance.pk] = False


@receiver(post_save, sender=Subscriber)
def welcome_email(sender, instance, created, **kwargs):
    if not created:
        return
    send_mail(
        subject="Ovoza.uz ga xush kelibsiz!",
        message="Obuna amalga oshirildi.",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[instance.email],
        html_message=f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#e0e0e0;padding:32px;border-radius:8px;">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="background:#c0392b;display:inline-block;padding:12px 24px;border-radius:4px;">
              <span style="font-size:24px;font-weight:900;color:#fff;">Ovoza</span>
            </div>
          </div>
          <h2 style="color:#fff;">Xush kelibsiz!</h2>
          <p style="color:#aaa;">Obuna amalga oshirildi. Bizni kuzatayotganingiz uchun rahmat!</p>
          <p style="color:#aaa;">Har kuni qaynoq yangiliklarni emailingizdan topasiz.</p>
          <div style="margin-top:32px;border-top:1px solid #2e2e2e;padding-top:16px;font-size:12px;color:#555;">
            &copy; 2025 Ovoza. Barcha huquqlar himoyalangan.
          </div>
        </div>
        """,
        fail_silently=True,
    )


@receiver(post_save, sender=Post)
def notify_users(sender, instance, created, **kwargs):
    was = _was_published.pop(instance.pk, False)
    # Faqat False → True bo'lganda yuboradi
    if not instance.is_published or was:
        return

    subscribers = list(Subscriber.objects.filter(is_active=True).values_list('email', flat=True))
    if not subscribers:
        return

    subject = f"Yangi yangilik: {instance.title}"
    message = f"""Salom!

{instance.title}

{instance.short_description}

To'liq o'qish: http://127.0.0.1:8000/about/{instance.id}/

Hurmat bilan,
Ovoza jamoasi"""

    emails = tuple(
        (subject, message, settings.EMAIL_HOST_USER, [email])
        for email in subscribers
    )
    send_mass_mail(emails, fail_silently=True)