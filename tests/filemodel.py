import unittest
import os
import io

class FileModelTest(unittest.TestCase):
 
    def setUp(self):
        self.allowable_path = os.getcwd()
        self.allowable_exts = ['.sql', '.txt']
        self.model = FileManager(self.allowable_path, self.allowable_exts)

        self.test_base_dir = os.path.join(self.allowable_path, 'tmp_test_1')
        self.test_file_path = os.path.join(self.test_base_dir, 'tmp_file_1.sql')
        self.test_dir_path = os.path.join(self.test_base_dir, 'tmp_test_2')

        if not os.path.exists(self.test_base_dir):
            os.makedirs(self.test_base_dir)

    def test_valid_path(self):
        self.assertTrue(self.model.get_filesystem(self.allowable_path))

    def test_add_file(self):
        self.delete_test_file()
        self.model.add(self.test_file_path)
        self.assertTrue(os.path.isfile(self.test_file_path))

    def test_add_folder(self):
        self.delete_test_dir()
        self.model.add(self.test_dir_path)
        self.assertTrue(os.path.isdir(self.test_dir_path))

    def test_delete_file(self):
        self.create_test_file()
        self.model.delete(self.test_file_path)
        self.assertFalse(os.path.exists(self.test_file_path))

    def test_delete_folder(self):
        self.create_test_folder()
        self.model.delete(self.test_dir_path)
        self.assertFalse(os.path.exists(self.test_dir_path))
        
    def test_get_file(self):
        self.create_test_file()
        self.assertTrue('hello world' in self.model.read(self.test_file_path)) 

    def test_invalid_ext(self):
        self.model.is_valid_extension('/home/testfile.exe')
        self.assertFalse(self.model.is_valid_extension('/home/testfile.exe'))

    def test_valid_ext(self):
        self.assertTrue(self.model.is_valid_extension('/home/test.sql'))

    def test_fs_unauth_path(self):
        with self.assertRaises(Exception):
            self.model.get_filesystem('/home/')

    def test_get_dir_listing(self):
        dir = self.model.get_dir_listing(os.getcwd())
        self.assertTrue(dir)

    def create_test_file(self):
        self.delete_test_file()
        with io.open(self.test_file_path, 'w') as f:
            f.write(u'hello world')

    def create_test_folder(self):
        if not os.path.exists(self.test_dir_path):
            os.mkdir(self.test_dir_path)

    def delete_test_file(self):
        if os.path.exists(self.test_file_path):
            os.remove(self.test_file_path)
        
    def delete_test_dir(self):
        if os.path.exists(self.test_dir_path):
            os.rmdir(self.test_dir_path)

    def tearDown(self):
        self.delete_test_file()
        self.delete_test_dir()

        if os.path.exists(self.test_base_dir):
            os.rmdir(self.test_base_dir)

if __name__ == '__main__':
    import sys
    sys.path.append(os.path.dirname(os.getcwd()))
    from models.filemodel import FileManager
    unittest.main()
