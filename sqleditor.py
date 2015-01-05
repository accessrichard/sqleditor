import copy
import datetime
import decimal
import hashlib
import json
import os
from flask import Flask, jsonify, request, Response, render_template, session
from flask.ext.session import Session
from flask.json import JSONEncoder
from models import sqlmodel
from models.database import LoginError
from models.filemodel import FileManager
from models import crypto

class SqlEditorJsonEncoder(JSONEncoder):

    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)

        if isinstance(obj, datetime.date):
            return str(obj)

        return super(SqlEditorJsonEncoder, self).default(obj)


app = Flask(__name__)
app.secret_key = os.urandom(64)
app.json_encoder = SqlEditorJsonEncoder
app.config.from_object('config.DevelopmentConfig')
Session(app)
file_model = FileManager(app.config['ALLOWABLE_PATH'],
                         app.config['ALLOWABLE_EXTS'])


def JsonResponse(obj):
    return Response(json.dumps(obj), mimetype='application/json')


def is_authorization_required(system):
    connection = app.config['DATABASES'][system]['connection']
    if type(connection) is dict:
        value = connection.values()
        return '{password}' in value or '{username}' in value

    return '{username}' in connection or '{password}' in connection
    
    
def get_secret_key():
    user_key = request.cookies.get('sqleditor', None)
    if user_key:
        sha = hashlib.sha224(user_key).hexdigest()
        key = sha + app.secret_key.encode('base64')[len(sha):]
        return key.decode('base64')

    return app.secret_key


def encrypt_user_config(config, username, password):
    config_copy = copy.deepcopy(config)
    key = get_secret_key()
    config_copy['username'] = crypto.aes_encrypt(key, username)
    config_copy['password'] = crypto.aes_encrypt(key, password)
    return config_copy


def decrypt_user_config(config):
    key = get_secret_key()
    username = crypto.aes_decrypt(key, config['username'])
    password = crypto.aes_decrypt(key, config['password'])
    return get_populated_config(config, username, password)


def get_authorized_config(system):
    config = app.config['DATABASES'][system]
    if not is_authorization_required(system):
        return config

    session_config = session.get(system, None)
    if not session_config:
        return None

    try:
        return decrypt_user_config(session_config)
    except crypto.AuthenticationError:
        session.clear()
        return None


def get_populated_config(config, username, password):
    user_config = copy.deepcopy(config)
    connection = user_config['connection']
    if type(connection) is dict:
        for k, v in connection.iteritems():
            if '{password}' in v:
                connection[k] = password
                continue
            if '{username}' in v:
                connection[k] = username

        return user_config

    user_config['connection'] = connection.replace('{username}', username) \
                                          .replace('{password}', password)
    return user_config


@app.route("/user/login", methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    system = request.form.get('system')
    system_config = app.config['DATABASES'][system]
    if not is_authorization_required(system):
        return jsonify(isSuccess=True)

    user_config = get_populated_config(system_config, username, password)

    try:
        sqlmodel.test_connection(user_config)
    except LoginError as e:
        return jsonify(isSuccess=False, message=str(e))

    session[system] = encrypt_user_config(system_config, username, password)
    session.permanent = True
    return jsonify(isSuccess=True)


@app.route('/user/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify(isSuccess=True)


@app.route("/user/settings", methods=['GET'])
def settings():
    return jsonify(limit=app.config.get('DATABASE_LIMIT', 300))
    

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/io/<id>', methods=['DELETE'])
def delete(id):
    file_model.delete(id.decode('base64'))
    return jsonify('')


@app.route("/io", methods=['POST'])
def add():
    parentId = request.json.get('parentId').decode('base64')
    name = request.json.get('name', '')
    content = request.json.get('content', '')
    return JsonResponse(file_model.add(parentId, name, content))


@app.route("/io/<id>", methods=['PUT'])
def save(id):
    content = request.json.get('content')
    node = file_model.save(id.decode('base64'), content)
    return JsonResponse(node)


@app.route("/io/<id>", methods=['GET'])
def get(id):
    node = file_model.get(id.decode('base64'))
    return JsonResponse(node)


@app.route("/io", methods=['GET'])
def ls():
    return JsonResponse(file_model.get(file_model.allowable_path))


@app.route("/database/query", methods=['POST'])
def query():
    system = request.json.get('system')
    config = get_authorized_config(system)
    if not config:
        return jsonify(isLoginRequired=True)

    sql = request.json.get('sql')
    limit = request.json.get('limit', app.config.get('DATABASE_LIMIT', 300))
    column_limit = app.config.get('COLUMN_DISPLAY_LIMIT', 200)
    fetch_type = config.get('fetch_type')
    try:
        result, description = sqlmodel.run(config, sql, limit, column_limit, fetch_type)
    except LoginError as e:
        return jsonify(message=str(e), isLoginRequired=True)
    
    return jsonify(data=result,
                   elapsed=description.elapsed,
                   count=description.rowcount,
                   idField=description.id,
                   columns=[x.__dict__ for x in description.columns],
                   message=description.message)


@app.route("/database/systems", methods=['GET'])
def get_systems():
    keys = app.config['DATABASES'].keys()
    systems = [{'value': x, 'label': x} for x in keys]
    systems.insert(0, {'value': '', 'label': ''})
    return JsonResponse(systems)


@app.route("/database/<system>", methods=['GET'])
@app.route("/database/<system>/<schema>", methods=['GET'])
@app.route("/database/<system>/<schema>/<table>", methods=['GET'])
def get_db_schemas(system, schema=None, table=None):
    config = get_authorized_config(system)
    if not config:
        return jsonify(isLoginRequired=True)

    search = request.args.get('name', None)

    if table:
        result = sqlmodel.get_database_columns(config, schema, table, search)
    elif schema:
        result = sqlmodel.get_database_tables(config, schema, search)
    else:
        result = sqlmodel.get_database_schemas(config, search)

    return JsonResponse(result)


@app.errorhandler(Exception)
def internal_error(error=None):
    message = {'status': 400, 'message': str(error)}
    resp = jsonify(message)
    resp.status_code = 400
    return resp


if __name__ == "__main__":
    app.run(host='0.0.0.0')
