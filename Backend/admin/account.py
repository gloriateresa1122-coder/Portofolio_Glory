from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from model import Database
from Backend.admin.login import token_required

account_bp = Blueprint("account", __name__)


@account_bp.route("/account/change-password", methods=["PUT"])
@token_required
def change_password(current_user):

    try:

        data = request.get_json()

        old_password = data.get("old_password")
        new_password = data.get("new_password")
        confirm_password = data.get("confirm_password")

        if not old_password or not new_password or not confirm_password:
            return jsonify({
                "success": False,
                "message": "Semua field wajib diisi"
            }),400

        if new_password != confirm_password:
            return jsonify({
                "success":False,
                "message":"Konfirmasi password tidak sama"
            }),400

        db = Database()

        query = """
        SELECT password_hash
        FROM users
        WHERE id=%s
        """

        result = db.execute_query(query,(current_user,),fetch=True)

        if not result:
            return jsonify({
                "success":False,
                "message":"User tidak ditemukan"
            }),404

        password_db = result[0]["password_hash"]

        valid = False

        try:
            valid = check_password_hash(password_db, old_password)
        except:
            valid = password_db == old_password

        if not valid:
            return jsonify({
                "success":False,
                "message":"Password lama salah"
            }),400

        new_hash = generate_password_hash(new_password)

        update = """
        UPDATE users
        SET password_hash=%s
        WHERE id=%s
        """

        db.execute_query(update,(new_hash,current_user))

        return jsonify({
            "success":True,
            "message":"Password berhasil diubah"
        })

    except Exception as e:

        return jsonify({
            "success":False,
            "message":str(e)
        }),500