import pymysql
import time
import logging
from config import Config

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class Database:
    _instance = None
    _conn = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
        return cls._instance

    def get_connection(self):
        if self._conn is None or not self._conn.open:
            try:
                # Tambahkan logger untuk membantu debugging di Vercel Logs
                logger.info(f"Mencoba koneksi ke: {Config.DB_HOST}")
                
                self._conn = pymysql.connect(
                    host=Config.DB_HOST,
                    user=Config.DB_USER,
                    password=Config.DB_PASSWORD,
                    database=Config.DB_NAME,
                    port=int(Config.DB_PORT),
                    ssl={"ca": None},
                    connect_timeout=10,
                    autocommit=True, # Mengubah ke True agar koneksi lebih stabil
                    cursorclass=pymysql.cursors.DictCursor
                )
                logger.info("Koneksi database berhasil!")
            except Exception as e:
                # Bagian ini akan mencetak error ke Dashboard Vercel Logs
                logger.error(f"GAGAL KONEKSI DATABASE: {str(e)}")
                raise e 
        return self._conn

    def execute_query(self, query, params=None, fetch=False):
        start_time = time.time()

        conn = self.get_connection()
        cursor = conn.cursor()

        try:
            cursor.execute(query, params or ())

            if fetch:
                result = cursor.fetchall()
            else:
                conn.commit()
                result = cursor.lastrowid

            logger.debug(f"Query executed in {time.time() - start_time:.3f}s")

            return result

        except Exception as e:
            conn.rollback()
            raise e

        finally:
            cursor.close()