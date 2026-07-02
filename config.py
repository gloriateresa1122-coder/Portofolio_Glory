import os
from dotenv import load_dotenv

if os.path.exists('.env'):
    load_dotenv()

class Config:
    @property
    def DB_HOST(self): return os.getenv("DB_HOST")
    @property
    def DB_PORT(self): return int(os.getenv("DB_PORT", 4000))
    @property
    def DB_USER(self): return os.getenv("DB_USER")
    @property
    def DB_PASSWORD(self): return os.getenv("DB_PASSWORD")
    @property
    def DB_NAME(self): return os.getenv("DB_NAME")
    
    # TAMBAHKAN INI:
    @property
    def SECRET_KEY(self): return os.getenv("SECRET_KEY", "default_secret_key_yang_aman")
    
    # Cloudinary
    @property
    def CLOUDINARY_CLOUD_NAME(self): return os.getenv("CLOUDINARY_CLOUD_NAME")
    @property
    def CLOUDINARY_API_KEY(self): return os.getenv("CLOUDINARY_API_KEY")
    @property
    def CLOUDINARY_API_SECRET(self): return os.getenv("CLOUDINARY_API_SECRET")
    
    # Resend
    @property
    def RESEND_API_KEY(self): return os.getenv("RESEND_API_KEY")

Config = Config()