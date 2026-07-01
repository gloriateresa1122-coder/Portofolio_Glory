from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from config import Config
import os
import resend  # Ditambahkan untuk fitur email

# Import blueprints
from Backend.admin.login import login_bp
from Backend.admin.dashboard import dashboard_bp
from Backend.admin.profiles import profiles_bp
from Backend.admin.experience import experience_bp
from Backend.admin.projects import projects_bp
from Backend.admin.skills import skills_bp
from Backend.utama.utama import utama_bp
from Backend.admin.upload import upload_bp
from Backend.admin.account import account_bp

def create_app():
    app = Flask(__name__, 
                static_folder='Frontend',
                template_folder='.')
    
    app.config.from_object(Config)
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    
    # Register blueprints
    app.register_blueprint(login_bp, url_prefix='/api')
    app.register_blueprint(dashboard_bp, url_prefix='/api')
    app.register_blueprint(profiles_bp, url_prefix='/api')
    app.register_blueprint(experience_bp, url_prefix='/api')
    app.register_blueprint(projects_bp, url_prefix='/api')
    app.register_blueprint(skills_bp, url_prefix='/api')
    app.register_blueprint(utama_bp, url_prefix='/api')
    app.register_blueprint(upload_bp, url_prefix='/api')
    app.register_blueprint(account_bp, url_prefix='/api')
    
    # RUTE UNTUK EMAIL (RESEND)
    @app.route('/api/contact', methods=['POST'])
    def contact():
        resend.api_key = app.config['RESEND_API_KEY']
        
        data = request.json
        try:
            params = {
                "from": "Portofolio Gloria <onboarding@resend.dev>",
                "to": "gloriateresa1122@gmail.com", 
                "subject": f"Pesan dari {data['name']}",
                "reply_to": data['email'], # Tambahkan baris ini!
                "html": f"<p><strong>Nama:</strong> {data['name']}</p><p><strong>Email:</strong> {data['email']}</p><p><strong>Pesan:</strong> {data['message']}</p>"
            }
            resend.Emails.send(params)
            return jsonify({"message": "Email berhasil dikirim!"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # RUTE UNTUK STATIC FILES
    @app.route('/<path:path>')
    def serve_static(path):
        if os.path.exists(os.path.join(app.root_path, 'Frontend', path)):
            return send_from_directory(os.path.join(app.root_path, 'Frontend'), path)
        return "File tidak ditemukan", 404

    # Route untuk index
    @app.route('/')
    def index():
        return send_from_directory(app.root_path, 'index.html')
    
    @app.errorhandler(404)
    def not_found(error):
        if request.path.startswith('/api/'):
            return jsonify({'error': 'API endpoint tidak ditemukan'}), 404
        return send_from_directory(app.root_path, 'index.html')
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Terjadi kesalahan pada server'}), 500
    
    
    @app.route('/login.html')
    def login_page():
        return send_from_directory(
            os.path.join(app.root_path, 'Frontend', 'admin'),
            'login.html'
        )
    
    @app.route('/admin/<path:filename>')
    def admin_files(filename):
        return send_from_directory(
            os.path.join(app.root_path, 'Frontend', 'admin'),
            filename
        )
        
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)