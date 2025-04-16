import time

import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/urlshortener")

retries = 5
while retries > 0:
    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        conn.close()
        break
    except psycopg2.OperationalError:
        print("Waiting for PostgreSQL to be ready...")
        retries -= 1
        time.sleep(3)
else:
    raise Exception("PostgreSQL is not available after retrying.")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
