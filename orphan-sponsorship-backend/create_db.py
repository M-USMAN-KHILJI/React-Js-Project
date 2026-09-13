"""
Create the PostgreSQL database named in .env (DB_NAME) if it does not exist.
Uses DB_USER / DB_PASSWORD / DB_HOST / DB_PORT from .env.
"""

from decouple import config
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

DB_NAME = config("DB_NAME", default="orphan_dbase")
DB_USER = config("DB_USER", default="postgres")
DB_PASSWORD = config("DB_PASSWORD", default="postgres")
DB_HOST = config("DB_HOST", default="localhost")
DB_PORT = config("DB_PORT", default="5432")

conn = psycopg2.connect(
    dbname="postgres",
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT,
)
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = conn.cursor()
cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (DB_NAME,))
if cur.fetchone():
    print(f"Database already exists: {DB_NAME}")
else:
    cur.execute(f'CREATE DATABASE "{DB_NAME}"')
    print(f"Created database: {DB_NAME}")
cur.close()
conn.close()
