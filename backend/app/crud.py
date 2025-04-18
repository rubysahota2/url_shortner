import string, random
from sqlalchemy.orm import Session
from . import models, schemas

def generate_short_code(length: int = 6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def create_short_url(db: Session, url_data: schemas.URLCreate):
    short_code = url_data.custom_alias or generate_short_code()
    db_url = models.URL(
        short_code=short_code,
        original_url=str(url_data.original_url).rstrip('/'),
        expiration=url_data.expiration
    )
    db.add(db_url)
    db.commit()
    db.refresh(db_url)
    return db_url

def get_url_by_code(db: Session, short_code: str):
    return db.query(models.URL).filter(models.URL.short_code == short_code).first()
