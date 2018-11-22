import os
from flask import Flask, render_template, request

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret' # this needs to be in separate file soon

@app.route('/'):
def index():
    return "Hello"
