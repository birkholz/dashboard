Dashboard
=========

A simple dashboard for Bixly/Xepler employees that integrates with Assembla.
**See the flask/angular branch for the latest code**

Installation:
```
pip install -r requirements.txt
```
create localsettings.py with your key and secret from [Assembla](https://www.assembla.com/user/edit/manage_clients):
```
api_key = 'YOUR_KEY_HERE'
api_secret = 'YOUR_SECRET_HERE'
port_number = 5000
```
Then start the server:
```
python dashboard.py
```
then go to localhost:5000 in your browser

##Pure JS version:
To bypass cross-server restrictions, open chrome with --disable-web-security flag
