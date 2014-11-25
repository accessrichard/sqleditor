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

1. Install python 2.7 from: https://www.python.org/downloads/
2. Add c:\python27 to your path. 
 * This can be done via Start -> Search bar and typing Environment Variables.
3. Install node.js from: http://nodejs.org/download/ 
4. Fix NPM missing folder error:
  ```
  >mkdir %appdata%\npm
  ```
5. Navigate to: https://pip.pypa.io/en/latest/installing.html
 * download get-pip.py
6. Execute :
```
> python get-pip.py
```
7. Add C:\Python27\Scripts and C:\Python27\Lib\site-packages to your path.
8. Execute:
```
>pip install virtualenv
```
9. Execute in the location where the project will reside.
```
>virtualenv venv
>venv\scripts\activate
>pip install -r requirements-windows.pip
```
10. Download and install Win32 OpenSSL v1.0.1j from:
http://slproweb.com/products/Win32OpenSSL.html
11. Install pyCrypto:
```
>easy_install http://www.voidspace.org.uk/downloads/pycrypto26/pycrypto-2.6.win32-py2.7.exe
```
12. git clone or download the sqleditor from GitHub. Then extract it where you created your virtualenv.
```
>cd static
>npm install intern
```
13. Download and install Git. Then add the Git.exe path to your environment variable. Bower needs Git to work.
14. Execute to install bower globally.
```
>npm install bower -g
```
15. Execute in the static directory of the project.
```
>bower install
```
16. Execute the following to start the dev server in the project root directory.
```
(venv) > python sqleditor.py
```
