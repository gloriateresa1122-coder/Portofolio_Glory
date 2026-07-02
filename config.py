import os
from dotenv import load_dotenv

# Memuat file .env hanya jika ada (untuk lokal)
if os.path.exists('.env'):
    load_dotenv()

class Config:
    # Menggunakan os.environ.get agar lebih aman
    DB_HOST = os.environ.get("DB_HOST")
    DB_PORT = int(os.environ.get("DB_PORT", 4000))
    DB_USER = os.environ.get("DB_USER")
    DB_PASSWORD = os.environ.get("DB_PASSWORD")
    DB_NAME = os.environ.get("DB_NAME")

    # Pastikan dictionary ini mengambil nilai yang benar
    MYSQL_CONFIG = {
        "host": DB_HOST,
        "port": DB_PORT,
        "user": DB_USER,
        "password": DB_PASSWORD,
        "database": DB_NAME,
        "ssl": {} 
    }

    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")
    DEBUG = os.environ.get("FLASK_DEBUG", "False").lower() == "true"

    # ... (sisanya sama)