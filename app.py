from flask import Flask, render_template

app = Flask(__name__)

# Route for the Home Page (Categories)
@app.route('/')
def index():
    return render_template('index.html')

# Route for the Items Page (e.g., /category/fruits)
@app.route('/category')
def items():
    return render_template('items.html')

# Route for the Cart Page
@app.route('/cart')
def cart():
    return render_template('cart.html')
# Add these to your app.py
@app.route('/success')
def success():
    return render_template('success.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

if __name__ == '__main__':
    app.run(debug=True)