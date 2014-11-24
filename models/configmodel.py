import crypto
import hashlib

def encrypt_user_config(config, username, password, salt=None):
    config_copy = copy.deepcopy(config)
    key = get_key(salt)
    config_copy['username'] = crypto.aes_encrypt(key, username)
    config_copy['password'] = crypto.aes_encrypt(key, password)
    return config_copy


def get_key(key, salt=None):
    if salt:
        sha = hashlib.sha224(salt).hexdigest()
        return (sha + key.encode('base64')[len(sha):]).decode('base64')

    return key


def decrypt_user_config(config, salt=None):
    key = get_key(salt)
    username = crypto.aes_decrypt(key, config['username'])
    password = crypto.aes_decrypt(key, config['password'])
    return get_user_config(config, username, password)


def get_user_config(user_config, username, password):
    connection = user_config['connection']
    if type(connection) is dict:
        for k, v in connection.items():
            if '{password}' in v:
                connection[k] = password
                continue
            if '{username}' in v:
                connection[k] = username

        return user_config

    user_config['connection'] = connection.replace('{username}', username) \
                                          .replace('{password}', password)
    return user_config


