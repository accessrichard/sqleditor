from __future__ import print_function
from functools import wraps
import os
import io
from os import listdir
from os.path import isfile, join, isdir


def validate_extension(f):
    """ Instance method decorator to validates
    a file extension is allowed.
    """
    @wraps(f)
    def wrapper(self, *args, **kwargs):
        path = args[0]
        if not self.is_valid_extension(path):
            raise Exception('File extension is not allowed')

        return f(self, *args, **kwargs)
    return wrapper


def validate_path(f):
    """ Instance method decorator to validate
    a path is under a base path.
    """
    @wraps(f)
    def wrapper(self, *args, **kwargs):
        path = args[0]
        if not self.is_valid_path(path):
            raise Exception('Unauthorized to access path.')

        return f(self, *args, **kwargs)
    return wrapper


def get_parent_dir(path):
    return os.path.abspath(os.path.join(path, os.pardir))


def get_file_name(path):
    return os.path.basename(path)


def is_valid_extension(file, valid_extensions=None):
    if not valid_extensions:
        return True

    ext = os.path.splitext(file)[-1].lower()
    return ext in valid_extensions or "*" in valid_extensions


def is_path_under_base(path, base):
    """Detirmines if a path is within a given base path.

    Example:
       /home/richie/test
         is under
        /home/richie

    Args:
      path (str): The path.
      base (str): The base path.
    """
    if isfile(path):
        path, f = os.path.split(path)

    if '..' in path or '~' in path:
        raise Exception('Relative paths are not supported. e.g. "~/../"')

    test_path = split_path(path)
    allow_path = split_path(base)
    return allow_path == test_path[:len(allow_path)]


def split_path(path):
    """ Splits the path into a list using os path seperator.

    Args:
      path (str): The path.
    """
    if path.endswith("/"):
        path = path[:-1]
    folders = []
    while True:
        path, folder = os.path.split(path)
        if folder != "":
            folders.append(folder.lower())
        elif path != "":
            folders.append(path.lower())
            break
        elif folder == "" and path == "":
            break

    folders.reverse()
    return folders


def encode(s):
    """ Encodes a string into base64 replacing the newline
    at the end.

    Args:
      s (str): The string.
    """
    return s.strip().encode('base64').replace('\n', '')


class FileManager(object):

    def __init__(self, allowable_path, allowable_exts):
        """ Manages reading, saving adding and removing
        files or folders from the filesystem.

        Args:
         allowable_path (str): The base path that is
            allowed to access. No operations can occur
            outside this path.
         allowable_exts (list of str): The allowable
            extensions that can be accessed.
        """
        self.allowable_path = allowable_path.lower()
        self.allowable_exts = [x.lower() for x in allowable_exts]

    @validate_path
    def get(self, path):
        """ Gets a file or folder. If the path is for a file,
        will output the file contents. If for a dir, will list
        the dir contents.

        Args:
         path (str): The path.
        """
        if isdir(path):
            return self.get_filesystem(path)

        return self.read(path)

    @validate_path
    def get_filesystem(self, path):
        """Recursively walks the file system building
        a tree of folders and files of type:
        Node(id, parent, children, name, isDir)

        Args:
          path (str): The path.
        """
        return FileTree(self.allowable_exts).get_tree(path)

    def get_root(self):
        """Gets the root node.
        """
        return [self.make_json_node(self.allowable_path)]

    def make_json_node(self, path):
        """Makes a JSON compatibile file system node.
        Args:
          path (str): The path.
        """
        return {'name': get_file_name(path),
                'id': encode(path),
                'parentId': encode(get_parent_dir(path)),
                'isDir': isdir(path)}

    @validate_path
    def get_dir_listing(self, path, isDirOnly=False):
        """Gets a flat list of directory contents
        Args:
         path (str): The directory path.
         isDirOnly (str): Whether to exclude files.
        """
        nodes = FileTree(self.allowable_exts).get_dir_listing(path, isDirOnly)
        return [{'name': x.name,
                 'id': x.id,
                 'parentId': x.parent_id,
                 'isDir': x.is_dir} for x in nodes]

    @validate_path
    def delete(self, path):
        """Deletes a file or folder.

        Args:
          path (str): The path.
        """
        if not os.path.exists(path):
            return

        if os.path.isfile(path):
            return self.delete_file(path)

        os.rmdir(path)

    @validate_extension
    def delete_file(self, path):
        os.remove(path)

    def add(self, path, name=None, contents=''):
        """Adds a file or folder.

        Args:
          path (str): The path to the file or folder.
          name (str): The optional filename.
        """
        if name:
            path = os.path.join(path, name)

        base, ext = os.path.splitext(path)

        if ext.strip() != "":
            return self.save(path, contents)

        return self.add_dir(path)

    @validate_path
    def add_dir(self, path):
        if not os.path.exists(path):
            os.makedirs(path)

        return self.make_json_node(path)

    @validate_path
    @validate_extension
    def save(self, path, contents=''):
        """Saves a file.

        Args:
         path (str): The path.
         contents (str): The file contents.
        """
        with io.open(path, 'w') as file:
            file.write(unicode(contents))

        return self.make_json_node(path)

    @validate_path
    @validate_extension
    def read(self, path):
        with open(path, 'r') as file:
            return file.read()

    def is_valid_path(self, path):
        return is_path_under_base(path, self.allowable_path)

    def is_valid_extension(self, path):
        return is_valid_extension(path, self.allowable_exts)


class FileTree(object):

    def __init__(self, file_filters=None):
        self.file_filters = file_filters
        self.root_id = None

    def print_tree(self, path):
        self._walk_tree(self._build_tree(path), print)

    def get_tree(self, path):
        """ A Tree data structure of type
        Node(id, parentId, name, isDir)

        Args:
          path (str): The path.
        """
        tree = []

        def appender(x):
            tree.append({'name': x.name,
                         'id': x.id,
                         'parentId': x.parent_id,
                         'isDir': x.is_dir})

        self._walk_tree(self._build_tree(path), appender)
        return tree

    def get_dir_listing(self, path, isDirOnly=False):
        lst = []
        if not os.path.exists(path):
            return lst

        parent_id = encode(get_parent_dir(path))
        for name in listdir(path):
            pth = join(path, name)
            if isdir(pth):
                lst.append(FileTree.Node(name, pth, parent_id, True))
            if isfile(pth) and isDirOnly \
               and is_valid_extension(path, self.allowable_exts):
                lst.append(FileTree.Node(name, pth, parent_id, False))
        return lst

    def _walk_tree(self, node, func):
        if node.id == self.root_id:
            func(node)
        for n in node.children:
            func(n)
            if n.children:
                self._walk_tree(n, func)

    def _build_tree(self, path):
        parent_id = encode(get_parent_dir(path))
        rootName = os.path.basename(path)
        self.root_id = encode(path)
        root = FileTree.Node(rootName, path, parent_id, True)
        tree = self._walk_dir(path, root)
        self._walk_files(path, root)
        return tree

    def _walk_dir(self, path, parentNode):
        if not os.path.exists(path):
            return parentNode
        for dirName in listdir(path):
            dir = join(path, dirName)
            if isdir(dir):
                currentNode = FileTree.Node(dirName, dir, parentNode.id, True)
                parentNode.children.append(self._walk_files(dir, currentNode))
                self._walk_dir(dir, currentNode)
        return parentNode

    def _walk_files(self, path, node):
        for fileName in listdir(path):
            file = join(path, fileName)
            if isfile(file) and is_valid_extension(file, self.file_filters):
                fileNode = FileTree.Node(fileName, file, node.id, False)
                node.children.append(fileNode)
        return node

    class Node(object):
        def __init__(self, name, id, parent_id, is_dir, children=None):
            if children is None:
                children = []
            self.children = children
            self.name = name
            self.id = encode(id)
            self.parent_id = parent_id
            self.is_dir = is_dir
