from flask import Blueprint, request, jsonify
from model import Database
from Backend.admin.login import token_required

profiles_bp = Blueprint('profiles', __name__)

@profiles_bp.route('/profiles', methods=['GET'])
@token_required
def get_profil(current_user):
    try:
        db = Database()
        query = "SELECT * FROM profiles LIMIT 1"
        result = db.execute_query(query, fetch=True)
        return jsonify({'success': True, 'data': result[0] if result else {}}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@profiles_bp.route('/profiles', methods=['PUT'])
@token_required
def update_profil(current_user):
    try:
        data = request.get_json()
        db = Database()
        foto_url = data.get('foto_url')

        # Cek apakah data profil sudah ada
        check_query = "SELECT id FROM profiles LIMIT 1"
        existing = db.execute_query(check_query, fetch=True)

        if existing:
            # Update hanya foto_url
            query = "UPDATE profiles SET foto_url = %s WHERE id = %s"
            db.execute_query(query, (foto_url, existing[0]["id"]))
        else:
            # Insert foto_url baru
            query = "INSERT INTO profiles (foto_url) VALUES (%s)"
            db.execute_query(query, (foto_url,))

        return jsonify({'success': True, 'message': 'Foto profil berhasil disimpan'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@profiles_bp.route('/profiles', methods=['DELETE'])
@token_required
def delete_profil(current_user):
    try:
        db = Database()
        # Mengosongkan foto_url di database
        query = "UPDATE profiles SET foto_url = NULL"
        db.execute_query(query)
        return jsonify({'success': True, 'message': 'Foto profil berhasil dihapus'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500