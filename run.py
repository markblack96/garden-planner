from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('navigation.html')
    
@app.route('/designer')
def designer():
    return 'This is design page'
    
@app.route('/map')
def map():
    return 'This is map page'