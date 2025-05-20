from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/debug')
def debug():
    return render_template('testing.html')

if __name__ == '__main__':
    app.run(debug=True)