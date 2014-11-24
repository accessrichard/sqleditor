from __future__ import print_function
import time
import re

try:
    import sqlite3
except ImportError:
    sqlite3 = None

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    psycopg2 = None

try:
    import pymysql
except ImportError:
    mysql = None


class LoginError(Exception):
    pass


class Db(object):

    date_identifiers = ['dttm', 'created_dt', 'created_dttm',
                        'date', 'datetime', 'timestamp', 'tmsp', 'created']

    def __init__(self, db, args, kwargs):
        self.db = db
        self.kwargs = kwargs
        self.args = args

    @classmethod
    def get(cls, database, *args, **kwargs):
        database = database.lower()
        if database == 'mysql':
            return MySqlDb(args, kwargs)
        elif database == 'postgresql':
            return PgSql(args, kwargs)
        elif database == 'sqlite':
            return SqlLite(args, kwargs)
        elif database == 'sqlserver':
            return SqlServer(args, kwargs)
        elif database == 'db2i':
            return Db2i(args, kwargs)
        raise TypeError('Invalid Database')

    def connect(self):
        return self.db.connect(*self.args, **self.kwargs)

    def query(self, sql):
        try:
            conn, cursor = None, None
            conn = self.connect()
            cursor = self.get_cursor(conn)
            start = time.clock()
            cursor.execute(sql)
            results = cursor.fetchall()
            elapsed = (time.clock() - start)
            cols = self.get_col_descriptions(cursor)
            return results, Description(cols,
                                        cursor.rowcount,
                                        elapsed,
                                        'id')
        except Exception as e:
            if self.is_login_error(e):
                raise LoginError(e)

            raise e
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    def insert(self, sql):
        conn = self.connect()
        cursor = self.get_cursor(conn)
        try:
            cursor.execute(sql)
            conn.commit()
            return cursor.lastrowid, cursor.rowcount
        finally:
            cursor.close()
            conn.close()

    def update(self, sql):
        conn = self.connect()
        cursor = self.get_cursor(conn)
        try:
            cursor.execute(sql)
            conn.commit()
            return cursor.rowcount
        finally:
            cursor.close()
            conn.close()

    def execute_non_query(self, sql):
        conn = self.connect()
        cursor = self.get_cursor(conn)
        try:
            cursor.execute(sql)
            conn.commit()
        finally:
            cursor.close()
            conn.close()

    def get_cursor(self, conn):
        return conn.cursor()

    def get_col_descriptions(self, cursor):
        return [Column(x[0], None) for x in cursor.description]

    def is_date_identifier(self, field):
        return 'date' if field.lower() in self.date_identifiers else ''

    def is_login_error(self, error):
        pass

    def test_connection(self):
        try:
            conn = None
            conn = self.connect()
        except Exception as e:
            if self.is_login_error(e):
                raise LoginError(e)

            raise e
        finally:
            if conn:
                conn.close()



class MySqlDb(Db):

    def __init__(self, args, kwargs):
        kwargs['cursorclass'] = pymysql.cursors.DictCursor
        super(MySqlDb, self).__init__(pymysql, args, kwargs)

    def get_py_type(self, code):
        if code == pymysql.TIMESTAMP:
            return 'Datetime'

    def get_col_descriptions(self, cursor=None):
        return [Column(x[0], self.get_py_type(x[1]))
                for x in cursor.description]

    def is_login_error(self, error):
        return isinstance(error, pymysql.err.OperationalError) \
            and error[0] == 2003 and '((1045,' in error[1]


class PgSql(Db):

    def __init__(self, args, kwargs):
        kwargs['cursor_factory'] = psycopg2.extras.RealDictCursor
        super(PgSql, self).__init__(psycopg2, args, kwargs)

    def get_py_type(self, code):
        if code == psycopg2.DATETIME:
            return 'Datetime'

    def get_col_descriptions(self, cursor=None):
        return [Column(x.name, self.get_py_type(x.type_code))
                for x in cursor.description]

    def is_login_error(self, error):
        return isinstance(error, psycopg2.OperationalError) \
            and 'FATAL:  password authentication failed for user' in error[0] \
            or re.match('FATAL:  role "\w+" does not exist', error[0])


class SqlLite(Db):

    def __init__(self, args, kwargs):
        super(SqlLite, self).__init__(sqlite3, args, kwargs)

    def dict_factory(self, cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    def get_cursor(self, conn):
        conn.row_factory = self.dict_factory
        return conn.cursor()

    def get_col_descriptions(self, cursor):
        return [Column(x[0], self.is_date_identifier(x[0]))
                for x in cursor.description]

    def is_login_error(self, error):
        return False


class SqlServer(Db):
    pass


class Db2i(Db):
    pass


class Description(object):

    def __init__(self, columns, rowcount, elapsed, id):
        self.columns = columns
        self.rowcount = rowcount
        self.elapsed = elapsed
        self.id = id
        self.message = 'Query executed in {} seconds'.format(self.elapsed)
        if self.rowcount > 0:
            self.message += ' and returned {} rows.'.format(self.rowcount)


class Column(object):

    def __init__(self, field, ttype=None, formatter=None,
                 label=None, sortable=True):
        self.field = field
        self.formatter = formatter
        self.ttype = ttype
        self.sortable = sortable
        self.label = field if label is None else label
