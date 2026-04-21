from django.urls import path

from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('about/<int:id>/', post_about, name='post_about'),
    path('about_section/', about_section, name='about_section'),
    path('categories/', categories, name='categories'),
    path('contact/', contact, name='contact'),
    path('categories_about/', categories_about, name='categories_about'),
    path('login/', login_page, name='login'),
    path('register/', register_page, name='register'),
    path('log_out/', logout_user, name='logout'),
    path('news_page/', news_page, name='news_page'),
    path('profile/', profile, name='profile'),

    path('avatar_upload/', avatar_upload, name='avatar_upload'),

    path('tag/<str:tag_name>/', tag_posts, name='tag_posts'),
    path('like/<int:id>/', like_post, name='like_post'),
    path('about/<int:post_id>/comment/', add_comment, name='add_comment'),
    path('share/<int:id>/', share_post, name='share_post'),
]