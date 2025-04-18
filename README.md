# URL Shortener (FastAPI + React + PostgreSQL + Docker)

This is a lightweight, containerized URL shortener built with FastAPI for the backend, React for the frontend, and PostgreSQL for persistent storage. It allows users to shorten URLs, track visits, set expiration dates, and manage short links with full CRUD functionality.

---

## Features

- Shorten long URLs
- Custom short aliases
- Expiration support (datetime)
- Visit tracking (increments on redirect)
- Full CRUD API (Create, Read, Update, Delete)
- React frontend with clean form UI
- Swagger UI for API testing
- Dockerized backend and frontend
- Automated backend tests with pytest

---

## Tech Stack

- FastAPI
- React (Vite)
- PostgreSQL
- SQLAlchemy
- Docker & Docker Compose
- Pytest for testing

---

## Setup Instructions

### 1. Clone and Navigate
```bash
unzip url_shortener_fixed.zip
cd url_shortener_fixed
```

### 2. Start Backend and Frontend
```bash
docker-compose up --build
```

### 3. Access the Application
- API Documentation: http://localhost:8000/docs
- Frontend Web App: http://localhost:3000

---

## API Reference

### POST `/shorten`
Create a new shortened URL.

**Request JSON:**
```json
{
  "original_url": "https://example.com",
  "custom_alias": "myalias",
  "expiration": "2025-06-01T12:00:00"
}
```

**Response JSON:**
```json
{
  "short_url": "http://localhost:8000/myalias",
  "short_code": "myalias",
  "original_url": "https://example.com",
  "created_at": "2024-04-17T14:00:00Z",
  "expiration": null,
  "visits": 0
}
```

---

### GET `/{short_code}`
Redirects to the original long URL.

- Increments the visit count
- Returns 410 Gone if the URL is expired
- Returns 404 Not Found if the short code does not exist

---

### GET `/shorten/{short_code}/info`
Returns metadata about a shortened URL.

**Response JSON:**
```json
{
  "short_code": "myalias",
  "original_url": "https://example.com",
  "created_at": "2024-04-17T14:00:00Z",
  "expiration": null,
  "visits": 3
}
```

---

### PUT `/shorten/{short_code}`
Update the destination URL or expiration.

**Request JSON:**
```json
{
  "original_url": "https://updated.com",
  "expiration": "2025-12-31T23:59:59"
}
```

---

### DELETE `/shorten/{short_code}`
Deletes the short URL from the system.

---

## Running Tests

### Option 1: Run inside Docker
```bash
docker-compose exec web pytest
```

### Option 2: Run locally
```bash
pip install pytest httpx
pytest -v
```

---

## Frontend Usage

The React frontend includes:

- Input for long URL
- Optional custom alias
- Date and time picker for expiration
- Lookup functionality
- Update and delete functionality
- Display of visit count and expiration

Access it via: http://localhost:3000

---

## Project Structure

```
url_shortener_fixed/
├── app/
│   ├── main.py
│   ├── crud.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── __init__.py
├── frontend/
│   └── src/
│       └── App.jsx
├── tests/
│   └── test_urls.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

---

## References

- **FastAPI Documentation** – Official docs with examples and async guides  
  https://fastapi.tiangolo.com/

- **SQLAlchemy ORM Tutorial** – Learn SQLAlchemy ORM for database access  
  https://docs.sqlalchemy.org/en/20/orm/quickstart.html

- **Python URL Shortner** - https://github.com/spoo-me/url-shortener

- **Designing a URL Shortening Service**
https://www.geeksforgeeks.org/system-design-url-shortening-service/

- **System Design : Scalable URL shortner service **
https://medium.com/@sandeep4.verma/system-design-scalable-url-shortener-service-like-tinyurl-106f30f23a82


