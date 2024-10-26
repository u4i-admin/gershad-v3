"""
Django settings for main project.

Generated by 'django-admin startproject' using Django 3.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os
import logging.config
from django.utils.translation import gettext_lazy as _

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

FRONT_WEB_URL = os.environ.get('FRONT_WEB_URL', None)
CORS_ORIGIN_WHITELIST = [FRONT_WEB_URL] if FRONT_WEB_URL is not None else []

CORS_ORIGIN_REGEX_WHITELIST = [
    r"^http:\/\/(10\.)[\d\.]+(:\d+)?$",
    r"^http:\/\/(172\.1[6-9]\.)[\d\.]+(:\d+)?$",
    r"^http:\/\/(172\.2[0-9]\.)[\d\.]+(:\d+)?$",
    r"^http:\/\/(172\.3[0-1]\.)[\d\.]+(:\d+)?$",
    r"^http:\/\/(192\.168\.)[\d\.]+(:\d+)?$",
    r"^https?:\/\/localhost(:\d+)?$",
    r"^capacitor:\/\/localhost(:\d+)?$",
]

SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = int(os.environ.get('DEBUG', default=0))
VERSION_NUM = os.environ.get('VERSION_NUM', 'NA')
BUILD_NUM = os.environ.get('BUILD_NUM', 'NA')
GIT_SHORT_SHA = os.environ.get('GIT_SHORT_SHA', 'NA')
LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')

COGNITO_POOL_ID = os.environ.get('COGNITO_POOL_ID', None)
COGNITO_POOL_REGION = os.environ.get('COGNITO_POOL_REGION', None)
AWS_COGNITO_ACCESS_KEY = os.environ.get('AWS_COGNITO_ACCESS_KEY', None)
AWS_COGNITO_SECRET_KEY = os.environ.get('AWS_COGNITO_SECRET_KEY', None)
AWS_SNS_ACCESS_KEY = os.environ.get('AWS_SNS_ACCESS_KEY', None)
AWS_SNS_SECRET_KEY = os.environ.get('AWS_SNS_SECRET_KEY', None)
AWS_SNS_REGION = os.environ.get('AWS_SNS_REGION', 'None')


REDIS_PASS = os.environ['REDIS_PASSWORD']
REDIS_HOST = os.environ['REDIS_HOST']

# Hot zone criteria settings
HOTZONE_RADIUS_M = int(os.environ.get('HOTZONE_RADIUS_M', 1000))
HOTZONE_REPORT_MAX_AGE_DAYS = int(os.environ.get('HOTZONE_REPORT_MAX_AGE_DAYS', 14))
HOTZONE_MIN_REPORTS_REACTIVATE = int(os.environ.get('HOTZONE_MIN_REPORTS_REACTIVATE', 10))
HOTZONE_MAX_REPORTS_DEACTIVATE = int(os.environ.get('HOTZONE_MAX_REPORTS_DEACTIVATE', 0))

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'django.contrib.gis',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_gis',
    'rangefilter',
    'leaflet',
    'main',
    'account',
    'report',
    'poi',
    'prediction',

    # Wagtail apps
    'wagtail.contrib.forms',
    'wagtail.contrib.redirects',
    'wagtail.contrib.modeladmin',
    'wagtail.contrib.styleguide',
    'wagtail.contrib.sitemaps',
    'wagtail.embeds',
    'wagtail.sites',
    'wagtail.users',
    'wagtail.snippets',
    'wagtail.documents',
    'wagtail.images',
    'wagtail.search',
    'wagtail.admin',
    'wagtail',
    'wagtail.contrib.simple_translation',
    'wagtail.locales',
    'wagtail_footnotes',
    'wagtail_headless_preview',

    'modelcluster',
    'taggit',

    'strawberry_django',
    'static_page',
]

MIDDLEWARE = [
    'main.middleware.RevisionMiddleware',
    # We don't need SecurityMiddleware, nginx will take care of security headers
    # 'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # We don't need ClickJacking, nginx will take care of X-Frame header
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'main.middleware.ResponseAndViewManipulationMiddleware',
    'wagtail.contrib.redirects.middleware.RedirectMiddleware',
]

AUTHENTICATION_BACKENDS = [
    # Django ModelBackend is the default authentication backend.
    'django.contrib.auth.backends.ModelBackend',
]

SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_COOKIE_AGE = 7200
# If this is False, session data will only be saved if modified
SESSION_SAVE_EVERY_REQUEST = True

ROOT_URLCONF = 'main.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates'),],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'main.wsgi.application'

AUTH_USER_MODEL = 'account.User'

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LOGGING_CONFIG = None
logging.config.dictConfig({
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'console': {
            'format': '%(asctime)s %(name)-12s %(levelname)-8s %(message)s',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'console',
        },
    },
    'loggers': {
        '': {
            'level': LOG_LEVEL,
            'handlers': ['console',],
        },
    },
})

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

LANGUAGES = [
    ('en', _('English')),
    ('fa', _('Farsi')),
]

# Redis
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': REDIS_HOST,
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'PASSWORD': REDIS_PASS,
        },
        'KEY_PREFIX': 'gershad',
    },
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ]
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = 'static/'

LEAFLET_CONFIG = {
    'DEFAULT_CENTER' : (32.6539, 51.6660),      # Isfahan: 32.6539° N, 51.6660° E
    'DEFAULT_ZOOM' : 5,
    'MAX_ZOOM' : 20,
    'MIN_ZOOM' : 1,
    'SCALE' : 'both',
    'ATTRIBUTION_PREFIX' : "Gershad Map"
}

DATA_UPLOAD_MAX_NUMBER_FIELDS = None

# Gershad params
APPEND_SLASH = False
REPORT_RADIUS_M = 0
DEFAULT_REPUTATION = 5.0
GRID_SIZE = 0.01
SRID = 4326
FADED_HOURS = 4
REPORT_EXPIRATION_DAYS = 1
COGNITO_EXIST_CACHE_TIMEOUT = 10 * 24 * 60 * 60       # 10 Days
COGNITO_MISS_CACHE_TIMEOUT = 60                       # 1 Minute
REPORT_INTERVAL_LIMIT_MIN = 30
REPORTS_NEAR_POI_RADIUS_M = int(os.environ.get('REPORTS_NEAR_POI_RADIUS_M', 1000))

# Google maps API key
GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY', None)

# GraphQL settings
STRAWBERRY_DJANGO = {
    "GENERATE_ENUMS_FROM_CHOICES": True,
    "MAP_AUTO_ID_AS_GLOBAL_ID": True
}


# Wagtail settings

WAGTAIL_CONTENT_LANGUAGES = LANGUAGES
# Wagtail setting to use a custom document model
WAGTAILDOCS_DOCUMENT_MODEL = 'static_page.CustomDocument'
# Links to documents point directly to the URL provided by the s3 storage
WAGTAILDOCS_SERVE_METHOD = 'direct'

WAGTAILDOCS_EXTENSIONS = ['pdf', 'doc', 'docx', 'rtf', 'txt', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'odt', 'ods', 'odp']

# WAGTAILDOCS_CONTENT_TYPES has no effect when WAGTAILDOCS_SERVE_METHOD = 'direct'
# To validate content types, we override the clean() method in static_page.models.CustomModel and use python-magic

# Don't add a trailing slash to Wagtail-served URLs
WAGTAIL_APPEND_SLASH = False

# Wagtail Embed finder settings
from wagtail.embeds.oembed_providers import all_providers

FACEBOOK_APP_ID = str(os.environ.get('FACEBOOK_APP_ID', ''))
FACEBOOK_APP_SECRET = os.environ.get('FACEBOOK_APP_SECRET', '')

WAGTAILEMBEDS_FINDERS = [
    # Handles Google Drive embeds
    {
        'class': 'main.embed_finders.google_drive.GoogleDriveEmbedFinder',
    },
    # Handles OneDrive embeds
    {
        'class': 'main.embed_finders.one_drive.OneDriveEmbedFinder',
    },
    # Handles Facebook and Instagram embeds
    {
        'class': 'wagtail.embeds.finders.facebook',
        'app_id': FACEBOOK_APP_ID,
        'app_secret': FACEBOOK_APP_SECRET,
    },
    {
        'class': 'wagtail.embeds.finders.instagram',
        'app_id': FACEBOOK_APP_ID,
        'app_secret': FACEBOOK_APP_SECRET,
    },
    # Handles all other oEmbed providers the default wagtail
    {
        'class': 'wagtail.embeds.finders.oembed',
        'providers': all_providers,
    }
]

WAGTAIL_SITE_NAME = 'Gershad'
WAGTAILADMIN_BASE_URL = FRONT_WEB_URL
WAGTAIL_EMAIL_MANAGEMENT_ENABLED = False
WAGTAIL_I18N_ENABLED = True

WAGTAILSEARCH_BACKENDS = {
    'default': {
        'BACKEND': 'wagtail.search.backends.database',
    },
}

WAGTAILADMIN_RICH_TEXT_EDITORS = {
    'default': {
        'WIDGET': 'wagtail.admin.rich_text.DraftailRichTextArea',
        'OPTIONS': {'features': ['h2', 'h3', 'h4', 'bold', 'italic', 'ol', 'ul', 'link', 'document-link', 'image', 'embed', 'footnotes']},
    }
}

WAGTAIL_HEADLESS_PREVIEW = {
    'CLIENT_URLS': {
        'default': FRONT_WEB_URL,
    },  # defaults to an empty dict. You must at the very least define the default client URL.
    'SERVE_BASE_URL': None,  # can be used for HeadlessServeMixin
    'REDIRECT_ON_PREVIEW': False,  # set to True to redirect to the preview instead of using the Wagtail default mechanism
    'ENFORCE_TRAILING_SLASH': True,  # set to False in order to disable the trailing slash enforcement
}
