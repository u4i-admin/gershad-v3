import os


BUILD_ENV = 'development'
DEBUG = True
LOG_LEVEL = 'DEBUG'

from .base import *

ALLOWED_HOSTS = ['*']

SECRET_KEY = 'CI-T3$T'

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'ci',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'postgis-postgis',
        'PORT': '5432',
    },
}

# Media Files
MEDIA_ROOT = os.path.join(BASE_DIR, 'MEDIA')
MEDIA_URL = '/media/'
MEDIAFILES_LOCATION = MEDIA_URL

STATICFILES_LOCATION = STATIC_URL

INTERNAL_IPS = ('127.0.0.1',)
