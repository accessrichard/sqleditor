SQLITE_TABLE_QUERY="""
SELECT
  tbl_name as name
FROM
  sqlite_master
WHERE
   (tbl_name = ? or 1 = 1)
   and tbl_name like ?
LIMIT 1000
"""

SQLITE_SCHEMA_QUERY="""
SELECT
   'default' as name
FROM
  sqlite_master
WHERE
  tbl_name = ?
  or 1 = 1
LIMIT 1
"""

MYSQL_TABLE_QUERY="""
SELECT
   table_name as name
FROM 
   information_schema.tables
WHERE
   table_schema = %s
   and table_name like %s
LIMIT 1000
"""

MYSQL_SCHEMA_QUERY="""
SELECT
    schema_name as name
FROM
    information_schema.SCHEMATA
WHERE
    schema_name like %s
LIMIT 1000
"""

MYSQL_COLUMN_QUERY="""
SELECT
   concat(column_name, ' (', data_type, ')') as name
FROM 
   information_schema.columns
WHERE
   table_schema = %s
   and table_name = %s
   and column_name like %s
LIMIT 1000
"""

PGSQL_TABLE_QUERY="""
SELECT
   table_name as name
FROM 
   information_schema.tables
WHERE
   table_schema = %s
   and table_name like %s
LIMIT 1000
"""

PGSQL_SCHEMA_QUERY="""
SELECT
    distinct table_schema as name
FROM
    information_schema.tables
WHERE
    table_schema like %s
LIMIT 1000
"""

PGSQL_COLUMN_QUERY="""
SELECT
   concat(column_name, ' (', data_type, ')') as name
FROM 
   information_schema.columns
WHERE
   table_schema = %s
   and table_name = %s
   and column_name like %s
LIMIT 1000
"""
