from django.contrib import admin

from account.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from account.forms import UserChangeForm


class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    fieldsets = (
        (None, {
            'fields': ('username', 'password', 'reporter')
        }),
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'email'),
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Dates', {
            'fields': ('last_login', 'date_joined'),
        })
    )

    add_fieldsets = (
        (None, {'fields': ('username', 'password1', 'password2', 'reporter', )}),
    )


admin.site.register(User, UserAdmin)
