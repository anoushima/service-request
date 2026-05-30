from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ServiceRequest

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    
    # Form shown when CREATING a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'role'),
        }),
    )

    # Form shown when EDITING an existing user
    fieldsets = (
        (None,              {'fields': ('username', 'password')}),
        ('Personal Info',   {'fields': ('first_name', 'last_name', 'email')}),
        ('Role',            {'fields': ('role',)}),
        ('Permissions',     {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    list_display = ('username', 'email', 'role', 'is_active', 'is_staff')
    list_filter  = ('role', 'is_active', 'is_staff')
    search_fields = ('username', 'email')


@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'priority', 'customer', 'assigned_agent')