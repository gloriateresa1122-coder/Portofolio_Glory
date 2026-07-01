from flask import Blueprint, jsonify
from model import Database


utama_bp = Blueprint('utama', __name__)


@utama_bp.route('/main-profile', methods=['GET'])
def get_main_profile():
    try:

        db = Database()

        profile = db.execute_query(
            "SELECT * FROM profiles LIMIT 1",
            fetch=True
        )

        skills = db.execute_query(
            "SELECT * FROM skills",
            fetch=True
        )

        experiences = db.execute_query(
            """
            SELECT *
            FROM experiences
            ORDER BY id DESC
            """,
            fetch=True
        )

        projects = db.execute_query(
            """
            SELECT *
            FROM projects
            ORDER BY id DESC
            """,
            fetch=True
        )

        return jsonify({

            "success": True,

            "data": {

                **(
                    profile[0]
                    if profile
                    else {}
                ),

                "skills":
                skills
                or [],

                "experiences":
                experiences
                or [],

                "projects":
                projects
                or []

            }

        }), 200


    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500



