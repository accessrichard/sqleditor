from datetime import timedelta
import information_schema 
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
            'schema_query': information_schema.SQLITE_SCHEMA_QUERY,
            'table_query': information_schema.SQLITE_TABLE_QUERY,
            'connection': './tests/test.db'
        }
        # 'MySql': {
        #     'db_type': 'mysql',
        #     'table_query': information_schema.MYSQL_TABLE_QUERY,
        #     'column_query': information_schema.MYSQL_COLUMN_QUERY,
        #     'schema_query': information_schema.MYSQL_SCHEMA_QUERY,
        #     'connection': {
        #         'host': '192.168.0.4',
        #         'user': '{username}',
        #         'passwd': '{password}',
        #         'db': 'test'
        #     }
        # },
        #  'PostgreSql': {
        #      'db_type': 'postgresql',
        #      'table_query': information_schema.PGSQL_TABLE_QUERY,
        #      'column_query': information_schema.PGSQL_COLUMN_QUERY,
        #      'schema_query': information_schema.PGSQL_SCHEMA_QUERY,
        #      'connection': "host='localhost' dbname='test' user='{username}' password='{password}'"
        #  },
        # 'Sample Name': {
        #     'db_type': 'pyodbc',
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
