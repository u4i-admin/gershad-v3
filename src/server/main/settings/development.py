import os
import sys

BUILD_ENV = 'development'
DEBUG = True
LOG_LEVEL = 'DEBUG'

from main.settings.base import *

# Database
DB_USER = os.environ['DATABASE_USER']
DB_PASSWORD = os.environ['DATABASE_PASSWORD']
DB_HOST = os.environ['DATABASE_HOST']
DB_NAME = os.environ['DATABASE_NAME']
DB_PORT = os.environ['DATABASE_PORT']
AWS_STORAGE_BUCKET_NAME = os.environ['AWS_STORAGE_BUCKET_NAME']
AWS_S3_REGION_NAME = os.environ['AWS_S3_REGION_NAME']
DJANGO_ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', '*')
DJANGO_POD_IP = os.environ.get('POD_IP', None)

ALLOWED_HOSTS = DJANGO_ALLOWED_HOSTS.split(',')
if DJANGO_POD_IP:
    ALLOWED_HOSTS.append(DJANGO_POD_IP)

INSTALLED_APPS += [
    'storages'
]

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
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

DEFAULT_FROM_EMAIL = FROM_EMAIL = os.environ.get('FROM_EMAIL', 'alias@mail.com')
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.mail.com')
EMAIL_PORT = os.environ.get('EMAIL_PORT', '587')
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', True)
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', 'alias@mail.com')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', 'yourpassword')

# Media Files
MEDIA_ROOT = os.path.join(BASE_DIR, 'MEDIA')
MEDIA_URL = '/media/'

DEFAULT_FILE_STORAGE = 'main.media_storage.MediaStorage'
MEDIAFILES_LOCATION = 'media'

INTERNAL_IPS = ('127.0.0.1',)

WS_S3_OBJECT_PARAMETERS = {
    'Expires': 'Thu, 31 Dec 2099 20:00:00 GMT',
    'CacheControl': 'max-age=94608000',
}

# Tell django-storages the domain to use to refer to static files.
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME

# Tell the staticfiles app to use S3Boto3 storage when writing the collected static files (when
# you run `collectstatic`).
STATICFILES_STORAGE = 'main.media_storage.StaticStorage'
STATICFILES_LOCATION = 'static'

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
