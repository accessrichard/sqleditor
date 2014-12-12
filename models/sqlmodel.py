import sqlparse
from database import Db, Column
from sqlparse.sql import Where
from sqlparse.tokens import Keyword, Punctuation


def run(config, sql, row_limit, column_limit, fetch_type=None):
    """ Runs a sql query against a database.
    
    Modifies the query as follows:
      1. Strips comments.
      2. Adds a limit clause.
      3. If no id field exists, adds one; ID()
    
    If the query is for a create, insert or update 
    will kick out an exception.

  Args:
       config (dict): The sqleditor database config section for
         DATABASES[system]
       sql (str): The sql statement.
       limit (int): The number of rows to limit the query by.
       fetch_type (str): The fetch type. One of; 'fetch', 'limit', 'top'.
          If no fetch type is provided then the default database fetch
          type is used. This parameter is more specific to odbc.

    Returns:
       A tuple of (results, description) where the description 
       contains the columns and elapsed time of the reults.
    """
    if is_modify_statement(sql):
        raise Exception("Only SELECT statements supported")


    cleansql = add_db_row_limit(
        config['db_type'], remove_comments(sql), row_limit, fetch_type)
    results, description = get_database(config).query(cleansql)

   if len(description.columns) > column_limit:
        set_column_hidden_attribute(column_limit, description.columns)

    if not [x.field for x in description.columns if x.field == 'id']:
        return add_id_field(results, description)

    return results, description


def set_column_hidden_attribute(column_limit, columns):
    """Sets the hidden attribute on columns higher
    than the column_limit.

    Args:
     column_limit (int) The number of columns that can be displayed.
     columns (list of Column) A list of columns.
    """
    if len(columns) <= column_limit:
        return columns

    x = 0
    for column in columns:
        x += 1
        if x > column_limit:
            column.hidden = True


def get_database(config):
    """Gets an instance of the database based on the
    flask config DATABASES[system][connection] values.
    This will either be a connection string or kwArgs.

    Args:
       config (dict): The sqleditor database config section for
         DATABASES[system]
    """
    db_args = config['connection']
    if type(db_args) is dict:
        kwArgs = dict((k, v) for (k, v) in db_args.iteritems())
        return Db.get(config['db_type'], **kwArgs)
    else:
        return Db.get(config['db_type'], db_args)
    

def test_connection(config):
    """ Tests a database connection by 
    running a dummy statement for example: select '';

    Args:
       config (dict): The sqleditor database config section for
         DATABASES[system]
    """
    return get_database(config).test_connection()

def add_id_field(results, description):
    """The dojo data stores are optimized for id fields.
    This allows for massive performance gains by allowing
    virtual scrolling. If no id field exists, need to add
    one to the result sets.
    """
    description.columns.insert(0, Column('id', label="ID()", hidden=True))
    num = 0
    for result in results:
        num += 1
        result['id'] = num

    return results, description
    

def add_db_row_limit(db_type, sql, limit=300, fetch_type=None):
    """Adds a database limit clause specific to 
    the database system if one does not exist.

    This is necassary so that large resultsets do not
    hose up the browser.

    Unlike jdbc there is no consistent way to limit rows
    thru Python's DB API 2, therefore are forced to limit the 
    resultsets thru parsing the sql statment and adding one.

    One of:
      * `limit {n}`
      * `top {n}`
      * `fetch first {n} rows only`.

    Args:
      db_type (str): The databse type. e.g. mysql, sqlite, postgresql.
      sql (str): The sql statement.
      limit (int): The max number of rows to fetch.
    """
    if db_type in ['mysql', 'sqlite', 'postgresql']:
        return add_limit_clause(sql, isFetch=False, limit=limit)
    if db_type in ['sqlserver']:
        return add_top_clause(sql, limit)
    if db_type in ['db2i']:
        return add_limit_clause(sql, limit, 'fetch')
    if db_type in ['pyodbc']:
        return add_limit(sql, fetch_type, limit)

    raise Exception('Db is not supported')


def format(self, sql):
    """ Formats a sql statement.

    Args:
      sql (str): The sql statement.
    """
    return sqlparse.format(sql, reindent=True, keyword_case='upper')


def remove_comments(sql):
    """Removes comments from a sql statement

    Args:
      sql (str): The sql statement.
    """
    return sqlparse.format(sql, strip_comments=True)


def is_modify_statement(sql):
    """Identifies whether the sql statement is 
    for an INSERT, UPDATE, DELETE, or CREATE.

    Args:
      sql (str): The sql statement.
    """
    for stmnt in sqlparse.parse(sql):
        if stmnt.get_type() in ['INSERT', 'UPDATE', 'DELETE', 'CREATE']:
            return True

    return False


def add_rowcount_limit(sql, limit=300, delimeter=';'):
    """ Sets the rowcount limit.

    Can be used in lieue of adding a `TOP` clause for databases
    that support it.

    Args:
      sql (str): The sql statement.
      limit (int): The row number limit.
      delimiter (str): The sql statement delimeter.
    """
    return 'set rowcount {}{} {}'.format(limit, delimeter, sql)


def add_limit(sql, fetch_type, limit=300, delimeter=';'):
    """ Adds a limit/fetch/top clause.

    Args:
      sql (str): The sql statement.
      fetch_type (str): The fetch type. One of; 'fetch', 'limit', 'top'.
          If no fetch type is provided then the default database fetch
          type is used. This parameter is more specific to odbc.
      limit (int): The row number limit.
      delimiter (str): The sql statement delimeter.
    """
    if fetch_type in ['fetch', 'limit']:
        return add_limit_clause(sql, limit, fetch_type, delimeter)

    return add_top_clause(sql, limit, delimeter)


def add_top_clause(sql, limit=300, delimeter=';'):
    """ Adds a TOP clause to the sql statements.

    Example:
     "select top 10 * from person;
      select top 10000 * from person;
      select * from person;"

    produces:

     "select top 10 * from person;
      select top 10000 * from person;
      select top 300 * from person;"

    Args:
      sql (str): The sql statement.
      limit (int): The row number limit.
    """
    cleansql = remove_comments(sql)
    stmnts = []
    for stmnt in sqlparse.parse(cleansql):
        select = stmnt.token_next_match(0, Keyword.DML, 'select')
        if select is None:
            continue

        top = [x for x in stmnt.tokens
               if isinstance(x, sqlparse.sql.Identifier)
               and 'top' in str(x).lower()]

        if not top:
            stmnt.insert_after(select, 'top {} '.format(limit))

        stmnts.append(stmnt)

    return ' '.join([str(x) for x in stmnts])


def add_limit_clause(sql, limit=300, fetch_type='limit', delimeter=';'):
    """ Adds a limit clause to the sql statements.

    If isFetch is true will use the `fetch first {n} rows only`
    syntax. Otherwise will use `limit {n}`.

    Example:
     "select * from person;
      select * from person limit 10000;
      select * from person limit 300;"

    produces:

     "select * from person limit 300;
      select * from person limit 10000;
      select * from person limit 300;"

   Args:
      sql (str): The sql statement.
      limit (int): The row number limit.
      fetch_type (str): Whether to use the LIMIT or FETCH FIRST syntax.
    """
    cleansql = remove_comments(sql)
    fetch_types = {'fetch': ' fetch first {} rows only'.format(limit),
                   'limit': ' limit {}'.format(limit)}
    stmnts = []

    for stmnt in sqlparse.parse(cleansql):
        select = stmnt.token_next_match(0, Keyword.DML, 'select')
        if select is None:
            continue

        where = stmnt.token_next_by_instance(0, Where)
        fetchpath = where if where else stmnt
        fetch = fetchpath.token_next_match(0, Keyword, fetch_type)
        if fetch:
            stmnts.append(stmnt)
            continue

        terminator = fetchpath.token_next_match(0, Punctuation, delimeter)
        if terminator:
            fetchpath.insert_before(terminator, fetch_types[fetch_type])
        else:
            stmnt.insert_after(stmnt.tokens[-1], fetch_types[fetch_type])

        stmnts.append(stmnt)

    return ' '.join([str(x) for x in stmnts])
