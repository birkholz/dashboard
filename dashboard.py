from flask import Flask, Response, render_template, request, jsonify
import requests
from localsettings import *

app = Flask(__name__)

headers = {
	'X-Api-Key': api_key,
	'X-Api-Secret': api_secret
}


@app.route('/')
def index():
	return Response(open('templates/index.html', 'r').read())


@app.route("/dashboard")
def dashboard():
    return render_template('dashboard.html')


def api_request(url, data=None, params=None):
	if (data):
		r = requests.put(url, headers=headers, data=data)
	else:
		r = requests.get(url, headers=headers, params=params)
	return Response(r.text, mimetype='application/json')


@app.route('/get_user')
def get_user():
	url = 'https://api.assembla.com/v1/user.json'
	return api_request(url)


@app.route('/get_spaces')
def get_spaces():
	url = 'https://api.assembla.com/v1/spaces.json'
	return api_request(url)


@app.route('/get_tickets/<space_id>')
def get_tickets(space_id):
	url = 'https://api.assembla.com/v1/spaces/%s/tickets.json' % (space_id,)
	return api_request(url, params={'report':8,'per_page':50})


if __name__ == "__main__":
    app.run(port=port_number)

