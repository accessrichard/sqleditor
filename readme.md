##Online Sql Editor

####A prototype of an online Sql Editor using Python/Flask and Dojo.

###Installation

You will need to install 3 components to get started.

* The pip components from ./requirements.pip
* The node modules from ./static/package.json
* The bower components from ./static/bower.json

```bash
$ pip install virtualenv
$ virtualenv venv
$ . venv/bin/activate
$ pip install -r requirements.pip
$ cd static
$ bower install
$ npm install
$ mv bower_modules ..
$ mv npm_modules ..
```

Once all components are installed you may need to tweak config.py
to configure some databases and a valid ALLOWABLE_PATH.

Then start the dev server with:

```bash
$ python sqleditor.py
```