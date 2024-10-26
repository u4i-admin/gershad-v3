import os
import sys

BUILD_ENV = 'local'
DEBUG = True
LOG_LEVEL = 'DEBUG'

from main.settings.base import *

ALLOWED_HOSTS = ['*']

# Database
DB_USER = os.environ['DATABASE_USER']
DB_PASSWORD = os.environ['DATABASE_PASSWORD']
DB_HOST = os.environ['DATABASE_HOST']
DB_NAME = os.environ['DATABASE_NAME']
DB_PORT = os.environ['DATABASE_PORT']

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': DB_NAME,
        'USER': DB_USER,
        'PASSWORD': DB_PASSWORD,
        'HOST': DB_HOST,
        'PORT': DB_PORT,
    },
}

# Email Settings
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = FROM_EMAIL = os.environ.get('FROM_EMAIL', 'alias@mail.com')

# Media Files
MEDIA_ROOT = os.path.join(BASE_DIR, 'MEDIA')
MEDIA_URL = '/media/'
MEDIAFILES_LOCATION = MEDIA_URL

STATICFILES_LOCATION = STATIC_URL

INTERNAL_IPS = ('127.0.0.1',)
