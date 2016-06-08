from pigeonly_test.settings import *

SECRET_KEY = 'vwn2!7ow-@azz(l#69k15&b15#)w4%b1f62m_8o&*s!clw(tk$'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'pigeonly_test',
        'USER': 'postgres',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': ''
    }
}

LOGGING = None