from flask import Blueprint, request, jsonify
from model import Database
from Backend.admin.login import token_required

experience_bp = Blueprint('experience', __name__)

# =========================
# GET ALL EXPERIENCES
# =========================
@experience_bp.route('/experiences', methods=['GET'])
def get_experiences():
    try:
        db = Database()

        query = """
            SELECT *
            FROM experiences
            ORDER BY id DESC
        """

        result = db.execute_query(query, fetch=True)

        return jsonify({
            'success': True,
            'data': result if result else []
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# =========================
# GET EXPERIENCE BY ID
# =========================
@experience_bp.route('/experiences/<int:id>', methods=['GET'])
def get_experience_by_id(id):
    try:
        db = Database()

        query = "SELECT * FROM experiences WHERE id = %s"
        result = db.execute_query(query, (id,), fetch=True)

        if not result:
            return jsonify({'error': 'Experience tidak ditemukan'}), 404

        return jsonify({
            'success': True,
            'data': result[0]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# =========================
# CREATE EXPERIENCE
# =========================
@experience_bp.route('/experiences', methods=['POST'])
@token_required
def create_experience(current_user):
    try:
        data = request.form

        db = Database()

        query = """
            INSERT INTO experiences
            (posisi, perusahaan, durasi, deskripsi, image_url)
            VALUES (%s,%s,%s,%s,%s)
        """

        values = (
            data.get('posisi'),
            data.get('perusahaan'),
            data.get('durasi'),
            data.get('deskripsi'),
            data.get('image_url')
            )
        
        new_id = db.execute_query(query, values)

        return jsonify({
            'success': True,
            'message': 'Experience berhasil dibuat',
            'id': new_id
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# =========================
# UPDATE EXPERIENCE
# =========================
@experience_bp.route('/experiences/<int:id>', methods=['PUT'])
@token_required
def update_experience(current_user, id):
    try:
        data = request.form
        db = Database()

        check_query = "SELECT id FROM experiences WHERE id = %s"
        existing = db.execute_query(check_query, (id,), fetch=True)

        if not existing:
            return jsonify({'error': 'Experience tidak ditemukan'}), 404

        allowed_fields = [
            'posisi',
            'perusahaan',
            'durasi',
            'deskripsi',
            'image_url'
        ]
        updates = []
        values = []

        for field in allowed_fields:
            value = data.get(field)
            if value is not None:
                updates.append(f"{field} = %s")
                values.append(value)

        if not updates:
            return jsonify({'error': 'Tidak ada data yang diupdate'}), 400

        values.append(id)

        query = f"""
            UPDATE experiences
            SET {', '.join(updates)}
            WHERE id = %s
        """

        db.execute_query(query, tuple(values))

        return jsonify({
            'success': True,
            'message': 'Experience berhasil diupdate'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# =========================
# DELETE EXPERIENCE
# =========================
@experience_bp.route('/experiences/<int:id>', methods=['DELETE'])
@token_required
def delete_experience(current_user, id):
    try:
        db = Database()

        check_query = "SELECT id FROM experiences WHERE id = %s"
        existing = db.execute_query(check_query, (id,), fetch=True)

        if not existing:
            return jsonify({'error': 'Experience tidak ditemukan'}), 404

        query = "DELETE FROM experiences WHERE id = %s"
        db.execute_query(query, (id,))

        return jsonify({
            'success': True,
            'message': 'Experience berhasil dihapus'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500