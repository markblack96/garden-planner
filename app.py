#!/usr/bin/python
from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')
    
@app.route('/designer')
def designer():
    return render_template('design.html') 
    
@app.route('/map')
def map():
    return render_template('maps.html')
