##Online Sql Editor

####A prototype of an online Sql Editor using Python/Flask and Dojo.

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
  * This can be done via Start -> Search bar and typing Environment Variables.
* Install node.js from: http://nodejs.org/download/ 
* Fix NPM missing folder error:
```
>mkdir %appdata%\npm
```
* Navigate to: https://pip.pypa.io/en/latest/installing.html and download get-pip.py
* Execute:
```
> python get-pip.py
```
* Add C:\Python27\Scripts and C:\Python27\Lib\site-packages to your path.
* Execute:
```
>pip install virtualenv
```
* Execute in the location where the project will reside.
```
>virtualenv venv
>venv\scripts\activate
>pip install -r requirements-windows.pip
```
* Download and install Win32 OpenSSL v1.0.1j from:
http://slproweb.com/products/Win32OpenSSL.html
* Install pyCrypto:
```
>easy_install http://www.voidspace.org.uk/downloads/pycrypto26/pycrypto-2.6.win32-py2.7.exe
```
* git clone or download this project. Then extract it where you created your virtualenv.
```
>cd static
>npm install intern
```
* Download and install Git. Then add the Git.exe path to your environment variable. Bower needs Git to work.
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
