from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import *

FA_ICONS = [
    ('fas fa-landmark', 'Siyosat (landmark)'),
    ('fas fa-trophy', 'Sport (trophy)'),
    ('fas fa-chart-line', 'Iqtisod (chart-line)'),
    ('fas fa-microchip', 'Texnologiya (microchip)'),
    ('fas fa-globe-asia', 'Dunyo (globe)'),
    ('fas fa-users', 'Jamiyat (users)'),
    ('fas fa-palette', 'Madaniyat (palette)'),
    ('fas fa-heartbeat', 'Salomatlik (heartbeat)'),
    ('fas fa-flask', 'Ilm-fan (flask)'),
    ('fas fa-graduation-cap', "Ta'lim (graduation)"),
    ('fas fa-leaf', 'Ekologiya (leaf)'),
    ('fas fa-video', 'Video (video)'),
    ('fas fa-newspaper', 'Yangiliklar (newspaper)'),
    ('fas fa-car', 'Avto (car)'),
    ('fas fa-utensils', 'Ovqat (utensils)'),
    ('fas fa-plane', 'Sayohat (plane)'),
    ('fas fa-music', 'Musiqa (music)'),
    ('fas fa-home', 'Ko\'chmas mulk (home)'),
    ('fas fa-briefcase', 'Biznes (briefcase)'),
    ('fas fa-gavel', 'Huquq (gavel)'),
    ('fas fa-satellite-dish', 'Media (satellite)'),
    ('fas fa-shield-alt', 'Xavfsizlik (shield)'),
    ('fas fa-home', 'Mahalliy (home)'),
    ('fas fa-folder', 'Boshqa (folder)'),

]

class PostContentInline(admin.StackedInline ):
    model = PostContent
    extra = 1

class PostGalleryInline(admin.TabularInline):
    model = PostGallery
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {"slug": ("name",)}

    class Media:
        css = {
            'all': (
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
            )
        }

    def icon_preview(self, obj):
        return format_html(
            '<span style="background:{};padding:8px 12px;'
            'border-radius:8px;color:white;font-size:18px;">'
            '<i class="{}"></i></span>',
            obj.color, obj.icon
        )
    icon_preview.short_description = 'Ko\'rinishi'

    def color_preview(self, obj):
        return format_html(
            '<div style="width:80px;height:24px;border-radius:4px;'
            'background:{};"></div>',
            obj.color
        )
    color_preview.short_description = 'Rang'

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)

        icon_choices = [('', '--Ikonka tanlang--')] + FA_ICONS
        form.base_fields['icon'].widget = admin.widgets.AdminTextInputWidget()

        return form

    def changeform_view(self, request, object_id=None, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context['fa_icons'] = FA_ICONS
        return super().changeform_view(request, object_id, form_url, extra_context)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {"slug": ("name",)}

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category',)
    prepopulated_fields = {"slug": ("title",)}
    inlines = [PostContentInline,PostGalleryInline]

    exclude = ('views', 'share')

    def save_model(self, request, obj, form, change):
        if not obj.author:
            obj.author = request.user
        super().save_model(request, obj, form,change)

@admin.register(AuthUser)
class AuthUserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Custom fields', {'fields': ('role', 'avatar')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
    )

    list_display = ('username', 'role', 'is_staff',)
    filter_horizontal = ('groups', 'user_permissions',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.role == 'admin':
            return qs
        return qs.filter(id=request.user.id)

    def has_change_permission(self, request, obj=None):
        if request.user.role == 'admin':
            return True
        return obj is None or obj == request.user

@admin.register(Advertisement)
class AdvertisementAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'created_at')
    list_editable = ('is_active',)

@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'created_at')