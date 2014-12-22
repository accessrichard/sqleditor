sqleditor
=============
An single page online sql editor with a file manager and tabbed workspaces using Python/Flask and Dojo.

###Installation

You will need to install components from 3 package managers to get started:

* The pip components from ./requirements.pip
* The node modules from ./static/package.json
* The bower components from ./static/bower.json

```bash
$ pip install virtualenv
$ virtualenv venv
$ . venv/bin/activate
(venv)$ pip install -r requirements.pip
(venv)$ cd static
(venv)$ npm install intern
(venv)$ bower install
(venv)$ mv npm_modules/* ..
```

Then start the dev server with:

```
(venv)$ python sqleditor.py
```

####Detailed installation instructions on Windows:
* Install python 2.7 from: https://www.python.org/downloads/
* Add c:\python27 to your path. 
* Install node.js from: http://nodejs.org/download/ 
* Fix NPM missing folder error:
```
>mkdir %appdata%\npm
```
* Download get-pip.py from https://pip.pypa.io/en/latest/installing.html
* Execute:
```
> python get-pip.py
```
* Add C:\Python27\Scripts and C:\Python27\Lib\site-packages to your path. Then execute:
```
>pip install virtualenv
```
* Execute in the location where the project will reside.
```
>virtualenv venv
>venv\scripts\activate
(venv)>pip install -r requirements-windows.pip
```
* Download and install Win32 OpenSSL v1.0.1j from:
http://slproweb.com/products/Win32OpenSSL.html
* Install pyCrypto:
```
(venv)>easy_install http://www.voidspace.org.uk/downloads/pycrypto26/pycrypto-2.6.win32-py2.7.exe
```
* Download or git clone this project and extract it to the location you created the virtual env.
```
>cd static
>npm install intern
```
* Bower has git as a dependency so make sure it is installed and added to the PATH.
* Execute to install bower globally.
```
>npm install bower -g
```
* Execute in the static directory of the project.
```
>bower install
```
* Execute the following to start the dev server in the project root directory.
```
(venv) > python sqleditor.py
```
