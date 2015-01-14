import os


class FileSearch(object):

    def __init__(self, id, path, teaser=''):
        self.id = id
        self.name = os.path.basename(path)
        self.label = path + '</br>'
        self.label += '<i>' + teaser + '</i>'
        self.base64path = path.encode('base64').replace('\n', '')


def _get_files(path, filters):
    matches = []
    for root, dirs, files in os.walk(path):
        for filename in files:
            if filename.lower().endswith(tuple(filters)):
                matches.append(os.path.join(root, filename))

    return matches


def _search_files(files, search_string):
    matches = []
    i = 0
    for file in files:
        lines = _search_file(file, search_string)

        i += 1
        if search_string in file and not lines:
            matches.append(FileSearch(i, file))
            continue

        if lines:
            matches.append(FileSearch(i, file, '<br/>'.join(lines)))

    return matches


def _search_file(file, search_string):
    matching_lines = []
    with open(file, 'r') as searchfile:
        previous_line = ''
        for line in searchfile:
            if search_string in line.lower():
                matching_lines.append(previous_line)
                matching_lines.append(line)

            previous_line = line

    return matching_lines


def search(path, filter, search_string):
    search_string = search_string.lower()
    if not os.path.exists(path) or os.path.isfile(path):
        raise ValueError('path must exist and must be a directory.')

    if search_string.strip() == '':
        return [FileSearch(0, '', 'Please enter search keyword')]

    return _search_files(_get_files(path, filter), search_string)
