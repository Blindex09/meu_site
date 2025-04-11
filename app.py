import os
import logging
from flask import Flask, render_template, request, flash, redirect, url_for
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/perceptible')
def perceptible():
    return render_template('perceptible.html')

@app.route('/operable')
def operable():
    return render_template('operable.html')

@app.route('/understandable')
def understandable():
    return render_template('understandable.html')

@app.route('/robust')
def robust():
    return render_template('robust.html')

@app.route('/aria')
def aria():
    return render_template('aria.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        # Basic validation
        if not name or not email or not message:
            flash('Por favor, preencha todos os campos obrigatórios.', 'error')
        elif '@' not in email:
            flash('Por favor, forneça um endereço de e-mail válido.', 'error')
        else:
            # In a real application, this would send an email or store the message
            flash('Mensagem enviada com sucesso! Obrigado pelo contato.', 'success')
            return redirect(url_for('contact'))
            
    return render_template('contact.html')

# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('base.html', error_message="Página não encontrada", error_code="404"), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('base.html', error_message="Erro interno do servidor", error_code="500"), 500
