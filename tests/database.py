import unittest
import os

class Mysql(unittest.TestCase):

    def setUp(self):
        self.db = Db.get('mysql', host="localhost", user="richie" , passwd="password", db="test")
        self.drop_table()
        self.create_table()
        self.insert_data()

    def tearDown(self):
        self.drop_table()        

    def create_table(self):
        sql = """
         CREATE TABLE IF NOT EXISTS `person` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `first_name` varchar(40) DEFAULT NULL,
        `last_name` varchar(40) DEFAULT NULL,
        `address` varchar(200) DEFAULT NULL,
        `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `date2` datetime DEFAULT NULL,
        PRIMARY KEY (`id`)
        ) ENGINE=InnoDB AUTO_INCREMENT=1110206 DEFAULT CHARSET=latin1
        """
        self.db.execute_non_query(sql)

    def drop_table(self):
        sql =  """ 
        drop table if exists person_test;
        """
        self.db.execute_non_query(sql)

    def insert_data(self):
        sql =  """
        insert into person values (default, 'Test', 'Person', 'Valley View 12', default, default);
        insert into person values (default, 'ad', 'ddferson', 'Vy View 12', null, default);
        insert into person values (default, 'dad', 'addn', '12 12312', default, null);
        """
        self.db.insert(sql)

    def test_query_result(self):
        result, description = self.db.query('select * from person limit 3')
        self.assertTrue(len(result) == 3)

    def test_query_result_type(self):
        result, description = self.db.query('select * from person limit 1')
        self.assertTrue(isinstance(result[0], dict))

    def test_query_column_desc(self):
        result, description = self.db.query('select * from person limit 1')
        self.assertTrue(isinstance(description.columns[0], Column))

    def test_query_elapsed(self):
        result, description = self.db.query('select * from person limit 1')
        self.assertTrue(description.elapsed > 0)

class PostgreSQL(unittest.TestCase):

    def setUp(self):
        conn_str = "host='localhost' dbname='test' user='richie' password='p@ssrich'"
        self.db = Db.get('postgresql', conn_str)
        self.drop_table()
        self.create_table()
        self.insert_data()

    def tearDown(self):
        self.drop_table()        

    def create_table(self):
        sql = """
        create table person_test
        (
        id serial primary key,
        first_name varchar(40),
        last_name varchar(40),
        address varchar(200),
        age int,
        created TIMESTAMP with time zone default now()
        );
        """
        self.db.execute_non_query(sql)

    def drop_table(self):
        sql =  """ 
        drop table if exists person_test;
        """
        self.db.execute_non_query(sql)

    def insert_data(self):
        sql =  """
        insert into person values (default, 'Test', 'Person', 'Valley View 12', 99, default);
        insert into person values (default, 'ad', 'ddferson', 'Vy View 12', 10, default);
        insert into person values (default, 'dad', 'addn', '12 12312', 10, null);
        """
        self.db.execute_non_query(sql)

    def test_query_result(self):
        result, description = self.db.query('select * from person limit 3')
        self.assertTrue(len(result) == 3)

    def test_query_result_type(self):
        result, description = self.db.query('select * from person limit 1')
        self.assertTrue(isinstance(result[0], dict))

    def test_query_column_desc(self):
        result, description = self.db.query('select * from person limit 1')
        self.assertTrue(isinstance(description.columns[0], Column))

    def test_query_elapsed(self):
        result, description = self.db.query('select * from person limit 1')
        self.assertTrue(description.elapsed > 0)

class SqlLite(unittest.TestCase):

    def setUp(self):
        path = os.path.join(os.getcwd(), 'test.db')
        self.db = Db.get('sqlite', path)
        self.drop_table()
        self.create_table()
        self.insert_data()

    def tearDown(self):
        self.drop_table()        

    def create_table(self):
        sql = """
        create table person_test
        (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name text,
        last_name text,
        address text,
        age integer,
        created datetime default current_timestamp
        )
        """
        self.db.execute_non_query(sql)

    def drop_table(self):
        sql =  """ 
        drop table if exists person_test;
        """
        self.db.execute_non_query(sql)

    def insert_data(self):
        sql =  """
        insert into person_test(first_name, last_name, address, age) values('Test', 'Person', 'Addr1', 44);
        """
        self.db.insert(sql)
        sql = """
        insert into person_test(first_name, last_name, address, age) values('Someone', 'Else', 'Addr2', 30);
        """
        self.db.insert(sql)
        sql = """
        insert into person_test(first_name, last_name, address, age) values('No', 'One', 'Adddr3', 14);
        """
        self.db.insert(sql)

    def test_query_result(self):
        result, description = self.db.query('select * from person_test limit 3') 
        self.assertTrue(len(result) == 3)

    def test_query_result_type(self):
        result, description = self.db.query('select * from person_test limit 1')
        self.assertTrue(isinstance(result[0], dict))

    def test_query_column_desc(self):
        result, description = self.db.query('select * from person_test limit 1')
        self.assertTrue(isinstance(description.columns[0], Column))

    def test_query_elapsed(self):
        result, description = self.db.query('select * from person_test limit 1')
        self.assertTrue(description.elapsed > 0)

if __name__ == '__main__':
    import sys
    sys.path.append(os.path.dirname(os.getcwd()))
    from models.database import Column
    from models.sqlmodel import Db
    unittest.main()
