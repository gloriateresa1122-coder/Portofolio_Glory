from flask import Blueprint, request, jsonify
from model import Database
from Backend.admin.login import token_required

skills_bp = Blueprint('skills', __name__)

@skills_bp.route('/skills', methods=['GET'])
def get_skills():
    try:
        db = Database()
        # Kita ambil manual kolomnya agar tidak ada konflik
        query = "SELECT id, nama_skill, icon_class FROM skills"
        result = db.execute_query(query, fetch=True)
        
        print("HASIL DARI DB:", result) # CEK TERMINAL FLASKMU!
        
        return jsonify({
            'success': True,
            'data': result if result else []
        }), 200
    except Exception as e:
        print("ERROR:", e)
        return jsonify({'error': str(e)}), 500

@skills_bp.route('/skills/<int:id>', methods=['GET'])
def get_skill_by_id(id):
    """Mengambil satu skill berdasarkan ID"""
    try:
        db = Database()
        
        query = "SELECT * FROM skills WHERE id = %s"
        result = db.execute_query(query, (id,), fetch=True)
        
        if not result:
            return jsonify({'error': 'Skill tidak ditemukan'}), 404
        
        return jsonify({
            'success': True,
            'data': result[0]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@skills_bp.route('/skills', methods=['POST'])
@token_required
def create_skill(current_user):
    try:
        data = request.get_json()
        
        if not data.get('nama_skill'):
            return jsonify({'error': 'nama_skill wajib diisi'}), 400
        
        db = Database()
        # HAPUS user_id DARI QUERY
        query = "INSERT INTO skills (nama_skill, icon_class) VALUES (%s, %s)"
        values = (data.get('nama_skill'), data.get('icon_class'))
        
        new_id = db.execute_query(query, values)
        
        return jsonify({'success': True, 'message': 'Skill berhasil dibuat', 'id': new_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@skills_bp.route('/skills/<int:id>', methods=['PUT'])
@token_required
def update_skill(current_user, id):
    """Update skill"""
    try:
        data = request.get_json()
        
        db = Database()
        
        check_query = "SELECT id FROM skills WHERE id = %s"
        existing = db.execute_query(check_query, (id,), fetch=True)
        
        if not existing:
            return jsonify({'error': 'Skill tidak ditemukan atau bukan milik Anda'}), 404
        
        allowed_fields = ['nama_skill', 'icon_class']
        updates = []
        values = []
        
        for field in allowed_fields:
            if field in data:
                updates.append(f"{field} = %s")
                values.append(data[field])
        
        if not updates:
            return jsonify({'error': 'Tidak ada data yang diupdate'}), 400
        
        values.append(id)
        query = f"UPDATE skills SET {', '.join(updates)} WHERE id = %s"
        db.execute_query(query, tuple(values))
        
        return jsonify({
            'success': True,
            'message': 'Skill berhasil diupdate'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@skills_bp.route('/skills/<int:id>', methods=['DELETE'])
@token_required
def delete_skill(current_user, id):
    """Delete skill"""
    try:
        db = Database()
        
        # Hapus pengecekan user_id karena kolom tidak ada
        check_query = "SELECT id FROM skills WHERE id = %s"
        existing = db.execute_query(check_query, (id,), fetch=True)
        
        if not existing:
            return jsonify({'error': 'Skill tidak ditemukan'}), 404
        
        query = "DELETE FROM skills WHERE id = %s"
        db.execute_query(query, (id,))
        
        return jsonify({
            'success': True,
            'message': 'Skill berhasil dihapus'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500