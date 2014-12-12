from datetime import timedelta
import os

class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.urandom(64)
    DATABASE_URI = ''
    SESSION_TYPE = 'filesystem'
    SESSION_KEY_PREFIX = 'sqleditor'
    PERMANENT_SESSION_LIFETIME = timedelta(days=1)
    ALLOWABLE_PATH = os.path.join(os.getcwd(), 'tests', 'filemanager')
    ALLOWABLE_EXTS = ['.sql']
    DATABASE_LIMIT = 300
    DATABASES = {
        'sqlite': {
            'db_type': 'sqlite',
            'requires_auth': False,
            'connection': './tests/test.db'
        }
        # 'MySql': {
        #     'db_type': 'mysql',
        #     'requires_auth': True,
        #     'connection': {
        #         'host': '127.0.0.1',
        #         'user': '{username}',
        #         'passwd': '{password}',
        #         'db': 'test'
        #     }
        # },
        # 'PostgreSql': {
        #     'db_type': 'postgresql',
        #     'requires_auth': True,
        #     'connection': "host='localhost' dbname='test' user='{username}' password='{password}'"
        # },
        # 'Sample Name': {
        #     'db_type': 'pyodbc',
        #     'requires_auth': True,
        #     #One of ['fetch', 'limit', or 'top']
        #     'fetch_type': 'fetch',
        #     'connection': 'DSN=dnsname;UID={username};PWD={password}'
        # }
    }


class ProductionConfig(Config):
    DATABASE_URI = ''


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
