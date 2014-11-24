import unittest

class SqlModelTest(unittest.TestCase):

    def add_db_row_limit(self, db):
        sql = 'select * from person'
        return sqlmodel.add_db_row_limit(db, sql, limit=10)

    def test_add_db_row_limit_mysql(self):
        limit = self.add_db_row_limit('mysql')
        self.assertTrue('limit 10' in limit)

    def test_add_db_row_limit_sqlite(self):
        limit = self.add_db_row_limit('postgresql')
        self.assertTrue('limit 10' in limit)

    def test_add_db_row_limit_sqlserver(self):
        limit = self.add_db_row_limit('sqlserver')
        self.assertTrue('top 10' in limit)

    def test_add_db_row_limit_db2i(self):
        limit = self.add_db_row_limit('db2i')
        self.assertTrue('fetch first 10 rows only' in limit)
    
    def test_is_modify_insert_stmnt(self):
        sql = """
        select * from person;
        insert into person values('test');
        select * from person; insert into person('test');
        """
        self.assertTrue(sqlmodel.is_modify_statement(sql))

    def test_is_modify_update_stmnt(self):
        sql = """
        select * from person;
        update into person values set p = 1;
        select * from person; update person set p = 1;
        """
        self.assertTrue(sqlmodel.is_modify_statement(sql))

    def test_is_not_modify_stmnt(self):
        sql = """
        select * from person where 'update' = type and 'insert' = in
        """
        self.assertFalse(sqlmodel.is_modify_statement(sql))

    def test_add_top_clause(self):
        sql = "select * from person; select top 1 * from two;"
        cleansql = sqlmodel.add_top_clause(sql, limit=300)
        self.assertTrue('select top 300 * from person;' in cleansql.strip())
        self.assertTrue('select top 1 * from two;' in cleansql.strip())

    def test_add_limit_clause(self):
        sql = "select * from person; select * from two limit 1;"
        cleansql = sqlmodel.add_limit_clause(sql, limit=300, isFetch = False)
        self.assertTrue('select * from person limit 300;' in cleansql.strip())
        self.assertTrue('select * from two limit 1;' in cleansql.strip())

    def test_add_fetch_clause(self):
        sql = """
        select * from person; 
        select * from two fetch first row only;
        select * from three fetch first 100 rows only;
        """
        cleansql = sqlmodel.add_limit_clause(sql, limit=300)
        self.assertTrue('select * from person fetch first 300 rows only;' in cleansql.strip())
        self.assertTrue('select * from two fetch first row only;' in cleansql.strip())
        self.assertTrue('select * from three fetch first 100 rows only;' in cleansql.strip())

    def test_remove_comments(self):
        sql = """
        --comment
        select * from test t --comment
        where 1 = 1 /* another comment */
        and 2 = 2 --
        /*comment*/and 3 = 3--
        """
        new_sql = """
        select * from test t where 1 = 1 and 2 = 2 and 3 = 3
        """.strip()

        cleansql = sqlmodel.remove_comments(sql)
        self.assertTrue(new_sql in cleansql)
        self.assertFalse('--' in cleansql 
                         or '/*' in cleansql 
                         or '*/' in cleansql)
    
if __name__ == '__main__':
    import sys
    import os
    sys.path.append(os.path.dirname(os.getcwd()))
    from models import sqlmodel
    unittest.main()
