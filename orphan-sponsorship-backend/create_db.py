"""
Create the PostgreSQL database named in .env (DB_NAME) if it does not exist.
Uses DB_USER / DB_PASSWORD / DB_HOST / DB_PORT from .env (or environment).
"""

from decouple import config
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT


def main() -> None:
    db_name = config("DB_NAME", default="orphan_dbase")
    db_user = config("DB_USER", default="postgres")
    db_password = config("DB_PASSWORD", default="postgres")
    db_host = config("DB_HOST", default="localhost")
    db_port = config("DB_PORT", default="5432")

    print(f"Connecting to PostgreSQL at {db_host}:{db_port} as {db_user}...")
    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port,
        )
    except Exception as exc:
        raise SystemExit(
            "Could not connect to PostgreSQL.\n"
            "Check that PostgreSQL is running and DB_USER / DB_PASSWORD / DB_HOST / DB_PORT are correct.\n"
            f"Details: {exc}"
        ) from exc

    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
    if cur.fetchone():
        print(f"Database already exists: {db_name}")
    else:
        # Quote identifier safely for unusual names
        cur.execute(f'CREATE DATABASE "{db_name}"')
        print(f"Created database: {db_name}")
    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
