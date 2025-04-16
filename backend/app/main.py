from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from datetime import datetime

from . import schemas, crud
from .database import SessionLocal, engine, Base

app = FastAPI()

# ✅ Add CORS FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/shorten")
def shorten_url(
    url: schemas.URLCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    if url.custom_alias:
        existing_alias = crud.get_url_by_code(db, url.custom_alias)
        if existing_alias:
            raise HTTPException(status_code=400, detail="Custom alias already taken")

    db_url = crud.create_short_url(db, url)
    short_url = f"{request.base_url}{db_url.short_code}"

    return {
        "short_url": short_url,
        "short_code": db_url.short_code,
        "original_url": db_url.original_url,
        "created_at": db_url.created_at,
        "expiration": db_url.expiration,
        "visits": db_url.visits
    }

@app.get("/{short_code}")
def redirect_url(short_code: str, db: Session = Depends(get_db)):
    db_url = crud.get_url_by_code(db, short_code)
    if not db_url:
        raise HTTPException(status_code=404, detail="URL not found")
    if db_url.expiration and db_url.expiration < datetime.utcnow():
        raise HTTPException(status_code=410, detail="URL expired")
    db_url.visits += 1
    db.commit()
    return RedirectResponse(db_url.original_url)
