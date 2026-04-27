import json
import random

from django.contrib.auth import authenticate, login, logout
from django.core.paginator import Paginator
from django.shortcuts import render, get_object_or_404, redirect
from .models import *
from django.db.models import F, Q, Count, Sum
from django.utils.timezone import now
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from allauth.socialaccount.models import SocialAccount
from django.core.paginator import Paginator
from datetime import timedelta

def get_lang_filter(request):
    lang = getattr(request, 'LANGUAGE_CODE', 'uz')
    if Post.objects.filter(is_published=True, language=lang).exists():
        return lang
    return 'uz'


def search_post(q):
    if not q:
        return Post.objects.none()
    return Post.objects.filter(is_published=True).filter(
        Q(title__icontains=q) |
        Q(short_description__icontains=q) |
        Q(author__first_name__icontains=q) |
        Q(author__last_name__icontains=q) |
        Q(author__username__icontains=q) |
        Q(category__name__icontains=q) |
        Q(tags__name__icontains=q)
    ).distinct().order_by('-created_at')


def search_view(request):
    q = request.GET.get('q', '').strip()
    lang = get_lang_filter(request)
    if q:
        posts = search_post(q).filter(language=lang)
        if not posts.exists():
            posts = search_post(q)
    else:
        posts = Post.objects.none()

    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    posts = paginator.get_page(page_number)

    return render(request, 'search.html', {'posts': posts, 'q': q})

def home(request):
    q= request.GET.get('q', '').strip()
    lang = get_lang_filter(request)

    recommended = Post.objects.filter(is_published=True, language=lang).order_by('-created_at')

    if not q:
        recommended = search_post(q)

    hero_post = Post.objects.filter(is_featured=True, is_published=True, language=lang).order_by('-created_at').first()
    if not hero_post:
        hero_post = Post.objects.filter(is_featured=True, is_published=True).order_by('-created_at').first()
    side_posts = Post.objects.filter(is_featured=True, is_published=True, language=lang).order_by('-created_at')[1:3]
    random_post = Post.objects.filter(is_published=True, language=lang).order_by('?')
    ticker = Post.objects.filter(is_published=True, language=lang).order_by('-created_at')[:10]
    exclude_ids = []
    if hero_post:
        exclude_ids.append(hero_post.id)
    exclude_ids += list(side_posts.values_list('id', flat=True))
    recommended = Post.objects.filter(is_published=True, language=lang).exclude(id__in=exclude_ids).order_by('-created_at')

    paginator = Paginator(recommended, 5)
    page_number = request.GET.get('page')
    recommended = paginator.get_page(page_number)

    categories = Category.objects.annotate(post_count=Count('post')).order_by('-post_count')[:6]
    for cat in categories:
        cat.latest_posts = cat.post_set.filter(is_published=True).order_by('-created_at')[:3]

    ctx = {
        'hero_post': hero_post,
        'side_posts': side_posts,
        'random_post': random_post,
        'ticker': ticker,
        'recommended': recommended,
        'categories': categories,
    }

    return render(request, 'index.html', ctx)



def get_client_ip(request):
    x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded:
        return x_forwarded.split(',')[0]
    return request.META.get('REMOTE_ADDR')


def post_about(request, id):
    about_post = get_object_or_404(Post, id=id, is_published=True)
    stat_blocks = about_post.blocks.filter(type='stat')
    related_posts = Post.objects.filter(category=about_post.category, is_published=True).exclude(id=id).order_by('-created_at')[:5]
    most_viewed = Post.objects.filter(is_published=True).order_by('-views')[:5]
    comments = about_post.comments.filter(parent=None).select_related('user').prefetch_related('replies__user')


    ip = get_client_ip(request)

    if request.user.is_authenticated:
        obj, created = PostView.objects.get_or_create(post=about_post, ip=f'user_(request.user.id)')
    else:
        obj, created = PostView.objects.get_or_create(post=about_post, ip=ip)

    if created:
        Post.objects.filter(id=about_post.id).update(views=F('views') + 1)
        about_post.refresh_from_db()

    response = render(request, 'news-detail.html', {
        'about_post': about_post,
        'stat_blocks': stat_blocks,
        'related_posts': related_posts,
        'most_viewed': most_viewed,
        'comments': comments,
        'advertisement': get_random_ad(),
    })
    return response

@require_POST
def add_comment(request, post_id):
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'Hisobga kirish talab etiladi!'})

    data = json.loads(request.body)
    message = data.get('message', '').strip()
    parent_id = data.get('parent_id', None)
    if not message:
        return JsonResponse({'success': False, 'message': 'Izoh Bo\'sh bo\'lishi mumkin emas!'})

    post = get_object_or_404(Post, id=post_id, is_published=True)
    parent = None
    if parent_id:
        parent = get_object_or_404(Comment, id=parent_id)

    comments = Comment.objects.create(
        post=post,
        user=request.user,
        message=message,
        parent=parent,
    )
    return JsonResponse({'success': True,
                        'comment': {
                            'id': comments.id,
                            'message': comments.message,
                            'user': comments.user.get_full_name() or comments.user.username,
                            'created_at': comments.created_at.strftime('%d %b, %H:%M'),
                            'parent_id': parent_id,
        }
    })

@login_required(login_url='/login/')
@require_POST
def edit_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id, user=request.user)
    data = json.loads(request.body)
    message = data.get('message', '').strip()
    if not message:
        return JsonResponse({'success': False, 'message': 'Izoh bo\'sh bo\'lishi mumkin emas!'})
    comment.message = message
    comment.save()
    return JsonResponse({'success': True})


@login_required(login_url='/login/')
@require_POST
def delete_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id, user=request.user)
    comment.delete()
    return JsonResponse({'success': True})

@require_POST
def like_post(request, id):
    post = get_object_or_404(Post, id=id)
    ip = get_client_ip(request)

    if request.user.is_authenticated:
        like, created = Like.objects.get_or_create(post=post, user=request.user, defaults={'ip':ip})
    else:
        like, created = Like.objects.get_or_create(post=post, ip=ip)

    if not created:
        like.delete()
        liked = False
    else:
        liked = True
    return JsonResponse({'liked': liked, 'count':post.likes.count()})

@require_POST
def share_post(request, id):
    Post.objects.filter(id=id).update(share=F('share') + 1)
    post = get_object_or_404(Post, id=id)
    return JsonResponse({'shares' : post.share})

def tag_posts(request, tag_name):
    tag = get_object_or_404(Tag, name=tag_name)
    lang = get_lang_filter(request)
    posts = Post.objects.filter(tags=tag, is_published=True, language=lang).order_by('-created_at')
    if not posts.exists():
        posts = Post.objects.filter(tags=tag, is_published=True).order_by('-created_at')
    all_tags = Tag.objects.annotate(post_count=Count('post')).order_by('-post_count')[:10]

    ctx = {
        'tag': tag,
        'posts': posts,
        'all_tags': all_tags,
    }

    return render(request, 'tag_posts.html', ctx)

def about_section(request):
    total_posts = Post.objects.filter(is_published=True).count()
    total_categories = Category.objects.count()
    team = AuthUser.objects.filter(
        role__in=['admin', 'author']
    ).annotate(post_count=Count('posts')).filter(post_count__gt=0).order_by('-post_count')[:4]

    return render(request, 'about.html', {
        'total_posts': total_posts,
        'total_categories': total_categories,
        'team': team,
    })


def categories(request):
    category = Category.objects.annotate(post_count=Count('post'))
    featured = category.order_by('-post_count')[:2]
    regular = category.order_by('-post_count')[2:]

    for cat in featured:
        cat.latest_posts = cat.post_set.order_by('-created_at')[:3]

    today = now().date()
    total_posts = Post.objects.filter(is_published=True).count()
    total_categories = Category.objects.count()
    todays_posts = Post.objects.filter(is_published=True, created_at__date=today).count()

    popular_tags = Tag.objects.annotate(post_count=Count('post')).order_by('-post_count')[:16]

    ctx = {
        'category': category,
        'featured': featured,
        'regular': regular,
        'total_posts': total_posts,
        'total_categories': total_categories,
        'todays_posts': todays_posts,
        'popular_tags': popular_tags,
    }
    return render(request, 'categories.html', ctx)


def categories_about(request, slug):
    category = get_object_or_404(Category, slug=slug)
    lang = get_lang_filter(request)

    posts = Post.objects.filter(category=category, is_published=True, language=lang).order_by('-created_at')
    if not posts.exists():
        posts = Post.objects.filter(category=category, is_published=True).order_by('-created_at')

    paginator = Paginator(posts, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    featured_post = page_obj.object_list.first()
    if featured_post:
        regular_posts = posts.exclude(id=featured_post.id)
    else:
        regular_posts = Post.objects.none()

    today = now().date()
    total_posts = Post.objects.filter(created_at__date=today).count()
    total_views = posts.aggregate(total=Sum('views'))['total'] or 0

    trend_posts = Post.objects.filter(category=category, is_published=True).order_by('-views')[:5]

    category_tags = Tag.objects.filter(post__category=category, post__is_published=True).annotate(post_count=Count('post')).order_by('-post_count')[:10]

    tab = request.GET.get('tab', 'all')

    if tab == 'latest':
        posts = posts.order_by('-created_at')
    elif tab == 'popular':
        posts = posts.order_by('-views')
    elif tab == 'video':
        posts = posts.filter(blocks__type='video').distinct()
    else:
        posts = posts.order_by('-created_at')

    similar_posts = Post.objects.none()
    if featured_post:
        tags = featured_post.tags.all()
        similar_posts = Post.objects.filter(tags__in=tags).exclude(id=featured_post.id).distinct().order_by('-views')[:4]

    ctx = {
        'category': category,
        'posts': posts,
        'page_obj': page_obj,
        'featured_post': featured_post,
        'regular_posts': regular_posts,
        'total_posts': total_posts,
        'total_views': total_views,
        'trend_posts': trend_posts,
        'similar_posts': similar_posts,
        'advertisement': get_random_ad(),
        'category_tags': category_tags,
        'tab': tab,
    }


    return render(request, 'category-detail.html', ctx)


def login_page(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email', '').strip()
        password = data.get('password', '')

        user = authenticate(request, username=email, password=password)
        if user is None:
            return JsonResponse({'success': False, 'message': 'Email yoki parol noto\'g\'ri'})

        login(request, user)
        remember = data.get('remember', False)
        if not remember:
            request.session.set_expiry(0)
        else:
            request.session.set_expiry(60 * 60 * 24 * 30)  # 30 kun
        return JsonResponse({'success': True, 'redirect': '/'})


    return render(request, 'login.html')



@login_required(login_url='/login/')
def profile(request):
    social = SocialAccount.objects.filter(user=request.user).first()

    if request.user.email:
        email = request.user.email
    elif social or social.extra_data.get('email'):
        email = social.extra_data.get('email')
    else:
        email = 'Email mavjud emas!'

    like_count = Like.objects.filter(user=request.user).count()
    user_comments = Comment.objects.filter(user=request.user).select_related('post').order_by('-created_at')
    comment_count = user_comments.count()
    joined = request.user.date_joined.strftime('%B %Y')

    liked_posts = Like.objects.filter(user=request.user).select_related('post', 'post__category').order_by('-created_at')
    liked_paginator = Paginator(liked_posts, 10)
    liked_page = request.GET.get('liked_page', 1)
    liked_posts = liked_paginator.get_page(liked_page)

    comment_posts = Comment.objects.filter(user=request.user).select_related('post').order_by('-created_at')
    comment_paginator = Paginator(comment_posts, 10)
    comment_page = request.GET.get('comment_page', 1)
    comment_posts = comment_paginator.get_page(comment_page)

    last_viewed = PostView.objects.filter(post__is_published=True).order_by('-created_at').first()
    last_read = last_viewed.post if last_viewed else None
    response = Like.objects.filter(user=request.user).values('post__category__name').annotate(total=Count('id')).order_by('-total').first()
    top_category = response['post__category__name'] if response else None
    today = now().date()
    today_views = PostView.objects.filter(created_at__date=today).count()
    total_view = PostView.objects.count()



    ctx = {
        'social': social,
        'email': email,
        'like_count': like_count,
        'user_comments': user_comments,
        'comment_count': comment_count,
        'joined': joined,
        'liked_posts': liked_posts,
        'comment_posts': comment_posts,
        'last_read': last_read,
        'top_category': top_category,
        'today_views': today_views,
        'total_view': total_view,
    }

    return render(request, 'profile.html', ctx)

@login_required(login_url='/login/')
@require_POST
def avatar_upload(request):
    if 'avatar' in request.FILES:
        request.user.avatar = request.FILES['avatar']
        request.user.save()
        return JsonResponse({'success': True, 'avatar_url': request.user.avatar.url})
    return JsonResponse({'success': False, 'message': 'Rasm topilmadi!'})

def register_page(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('first_name', '').strip()
        surname = data.get('last_name', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')

        if not name or not surname or not password:
            return JsonResponse({'success': False, 'message': "Ism, familiya va parol kiritilmagan!"})

        if AuthUser.objects.filter(email=email).exists():
            return JsonResponse({'success': False, 'message': 'Bu email band!'})

        user = AuthUser.objects.create_user(
            username=email,
            first_name=name,
            last_name=surname,
            email=email,
            password=password,
            role='user'
        )
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        return JsonResponse({'success': True})

    return render(request, 'register.html')

def logout_user(request):
    logout(request)
    return redirect('login')

def contact(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        first_name = data.get('first_name', '').strip()
        email = data.get('email', '').strip()
        message_text = data.get('message', '').strip()

        if not first_name or not email or not message_text:
            return JsonResponse({'success': False, 'message': "Barcha majburiy maydonlarni to'ldiring!"})

        subject = data.get('subject', 'umumiy')
        extra_info = {}
        if subject == 'hamkorlik' and data.get('company'):
            extra_info['company'] = data['company'].strip()
        elif subject == 'reklama':
            if data.get('ad_format'):
                extra_info['ad_format'] = data['ad_format']
            if data.get('ad_budget'):
                extra_info['ad_budget'] = data['ad_budget'].strip()
        elif subject == 'xato' and data.get('article_url'):
            extra_info['article_url'] = data['article_url'].strip()

        ContactMessage.objects.create(
            first_name=first_name,
            last_name=data.get('last_name', '').strip(),
            email=email,
            phone=data.get('phone', '').strip(),
            subject=subject,
            message=message_text,
            extra_info=extra_info or None,
        )
        return JsonResponse({'success': True})

    return render(request, 'contact.html')


def news_page(request):
    cat_slug = request.GET.get('cat', '')
    sort = request.GET.get('sort', 'newest')
    lang = get_lang_filter(request)

    posts = Post.objects.filter(is_published=True, language=lang)

    if cat_slug:
        posts = posts.filter(category__slug=cat_slug)

    if sort == 'popular':
        posts = posts.order_by('-views')
    elif sort == 'discussed':
        posts = posts.annotate(comment_count=Count('comments')).order_by('-comment_count')
    else:
        posts = posts.order_by('-created_at')

    total_count = posts.count()

    paginator = Paginator(posts, 10)
    page_obj = paginator.get_page(request.GET.get('page', 1))

    categories = Category.objects.annotate(post_count=Count('post')).order_by('-post_count')
    popular_posts = Post.objects.filter(is_published=True).order_by('-views')[:5]
    popular_tags = Tag.objects.annotate(post_count=Count('post')).order_by('-post_count')[:12]

    return render(request, 'news.html', {
        'page_obj': page_obj,
        'categories': categories,
        'popular_posts': popular_posts,
        'popular_tags': popular_tags,
        'current_cat': cat_slug,
        'current_sort': sort,
        'total_count': total_count,
        'advertisement': get_random_ad(),
    })

@require_POST
def subscribe(request):
    data = json.loads(request.body)
    email = data.get('email', '').strip()
    if not email:
        return JsonResponse({'success': False, 'message': "Email kiritilmadi!"})
    if Subscriber.objects.filter(email=email).exists():
        return JsonResponse({'success': False, 'message': "Siz allaqachon obuna bo'lgansiz!"})
    Subscriber.objects.create(email=email)
    return JsonResponse({'success': True, 'message': "Obuna muvaffaqiyatli amalga oshirildi. Bizni kuzatayotganingiz uchun rahmat😊!"})

def password_reset_page(request):
    return render(request, 'password_reset.html')

def password_reset_done_page(request):
    return render(request, 'password_reset_done.html')

def get_random_ad():
    ads = Advertisement.objects.filter(is_active=True)
    if ads.exists():
        ad = random.choice(list(ads))
        if ad.video_url:
            url = ad.video_url
            # youtube.com/watch?v= yoki youtu.be/ yoki m.youtube.com
            if 'youtube.com/watch' in url or 'm.youtube.com' in url:
                video_id = url.split('v=')[-1].split('&')[0]
                ad.video_url = f'https://www.youtube.com/embed/{video_id}'
            elif 'youtu.be/' in url:
                video_id = url.split('youtu.be/')[-1].split('?')[0]
                ad.video_url = f'https://www.youtube.com/embed/{video_id}'
        return ad
    return None

def category_posts_ajax(request, slug):
    category = get_object_or_404(Category, slug=slug)
    tab = request.GET.get('tab', 'all')

    posts = Post.objects.filter(category=category, is_published=True)

    if tab == 'latest':
        posts = posts.order_by('-created_at')
    elif tab == 'popular':
        posts = posts.order_by('-views')
    elif tab == 'video':
        posts = posts.filter(blocks__type='video').distinct()
    else:
        posts = posts.order_by('-created_at')

    data = []
    for post in posts:
        data.append({
            'id': post.id,
            'title': post.title,
            'short_description': post.short_description,
            'image': post.image.url if post.image else '',
            'views': post.views,
            'time_since': post.time_since(),
            'url': f'/about/{post.id}/',
        })

    return JsonResponse({'posts': data})
