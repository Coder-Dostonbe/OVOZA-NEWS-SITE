import json
from django.contrib.auth import authenticate, login, logout
from django.core.paginator import Paginator
from django.shortcuts import render, get_object_or_404, redirect
from .models import *
from django.db.models import F, Q, Count
from django.utils.timezone import now
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from allauth.socialaccount.models import SocialAccount
from django.core.paginator import Paginator

def home(request):
    q = request.GET.get('q', '').strip()   # .split() o'chirildi — string bo'lishi kerak

    posts = Post.objects.filter(is_published=True).order_by('-created_at')
    hero_post = Post.objects.filter(is_featured=True, is_published=True).first()
    random_post = Post.objects.filter(is_published=False).order_by('?')


    if q:
        posts = posts.filter(
            Q(title__icontains=q) |
            Q(short_description__icontains=q)
        )

    paginator = Paginator(posts, 5)
    page_number = request.GET.get('page')
    posts = paginator.get_page(page_number)

    ctx = {
        'posts': posts,
        'q': q,
        'hero_post': hero_post,
        'random_post': random_post,
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
    most_viewed = Post.objects.filter(is_published=True).order_by('-views')
    comments = about_post.comments.filter(parent=None).select_related('user').prefetch_related('replies__user')
    advertisement = Advertisement.objects.filter(is_active=True).first()

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
        'advertisement': advertisement,
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
    posts = Post.objects.filter(tags=tag).order_by('-created_at')
    all_tags = Tag.objects.annotate(post_count=Count('post')).order_by('-post_count')[:10]

    ctx = {
        'tag': tag,
        'posts': posts,
        'all_tags': all_tags,
    }

    return render(request, 'tag_posts.html', ctx)

def about_section(request):
    return render(request, 'about.html')


def categories(request):
    return render(request, 'categories.html')


def categories_about(request):
    return render(request, 'category-detail.html')


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
    return render(request, 'contact.html')


def news_page(request):
    return render(request, 'news.html')

def password_reset_page(request):
    return render(request, 'password_reset.html')

def password_reset_done_page(request):
    return render(request, 'password_reset_done.html')



