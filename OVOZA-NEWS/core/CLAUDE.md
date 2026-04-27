# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ovoza** is an Uzbek-language news portal built with Django 6.0.2. It supports publishing news posts with rich content blocks, nested comments, likes, email newsletter subscriptions, Google OAuth login, and advertisement management.

## Development Commands

```bash
# Run development server
python manage.py runserver

# Apply migrations after model changes
python manage.py migrate

# Create and apply new migration
python manage.py makemigrations
python manage.py migrate

# Compile translation files after editing .po files
python manage.py compilemessages

# Regenerate translation source files
python manage.py makemessages -l uz -l en -l ru

# Run tests
python manage.py test
```

## Environment Setup

Requires a `.env` file in the project root with:
```
EMAIL_HOST_USER=<gmail_address>
EMAIL_HOST_PASSWORD=<gmail_app_password>
```

Key dependencies (no `requirements.txt` exists — install manually):
- `django==6.0.2`
- `django-allauth`
- `django-ckeditor-5`
- `django-jazzmin`
- `python-slugify`
- `python-dotenv`
- `Pillow`

## Architecture

### Single-App Structure

All business logic lives in one Django app: `ovoza/`. The `core/` directory is the Django project config (settings, root URLs, wsgi/asgi). There is no service layer — views call models directly.

### Custom User Model

`ovoza.AuthUser` extends `AbstractUser` with a `role` field (`admin`/`author`/`user`) and an `avatar` ImageField. It must be set as `AUTH_USER_MODEL` in settings (already done). Always import the user model via `get_user_model()` or reference `settings.AUTH_USER_MODEL` in ForeignKey fields.

### Content Model Design

Posts are composed of two related models:
- `Post` — metadata (title, slug, author, category, tags, image, view/share counters)
- `PostContent` — ordered content blocks with 7 types: `text`, `title`, `image`, `quote`, `stat`, `info`, `video`. The `video` type auto-converts YouTube watch URLs to embed format via a `save()` override.

### Slug Generation

Both `Post` and other slug-bearing models auto-generate slugs in their `save()` using `python-slugify`. Collision is handled by appending a counter suffix. Do not set slugs manually.

### Anonymous Tracking

`PostView` and `Like` track engagement per IP address, not just per user. The `get_client_ip()` helper in `views.py` handles proxy headers. Both models have a unique constraint on `(post, ip)` to prevent duplicates.

### Signal-Based Emails

`ovoza/signals.py` contains three signals registered in `OvozaConfig.ready()`:
1. `track_published` — pre-save, watches `is_published` state changes
2. `welcome_email` — post-save on `Subscriber` creation
3. `notify_users` — post-save on `Post` publication, sends bulk mail to all subscribers

Email is sent via Gmail SMTP. The notification email has a hardcoded `http://127.0.0.1:8000` URL — this must be changed before any production deployment.

### AJAX Endpoints

Several URLs return JSON rather than HTML and are consumed by vanilla JS in templates:
- Like toggle: `POST /like/<id>/`
- Comments (add/edit/delete): `POST /about/<id>/comment/`, `/comment/edit/<id>/`, `/comment/delete/<id>/`
- Share counter: `POST /share/<id>/`
- Newsletter: `POST /subscribe/`
- Category tab filtering: `GET /category/<slug>/posts/`
- Avatar upload: `POST /avatar_upload/`

Login and registration (`/login/`, `/register/`) also accept JSON POST and return JSON — they do not use Django forms.

### Internationalization

The site supports Uzbek (`uz`), English (`en`), and Russian (`ru`). Templates use `{% trans %}` tags. Compiled `.mo` files must exist in `locale/` for translations to work. The default `LANGUAGE_CODE` is `uz`.

### Admin

Uses `django-jazzmin` for UI. `PostContentInline` and `PostGalleryInline` are attached to `PostAdmin` for inline editing. The `AuthUserAdmin` filters querysets by role — non-admin staff only see themselves.

## Known Issues

- `SECRET_KEY` is hardcoded in `settings.py` (should be moved to `.env`)
- `DEBUG = True` and `ALLOWED_HOSTS = []` — not production-ready
- Hardcoded `http://127.0.0.1:8000` in `signals.py` email body
- No `requirements.txt`
- In `views.py`, `PostView` IP lookup uses `f'user_(request.user.id)'` (missing braces — likely a bug)