# URL Shortener - Design, Setup, and Usage Documentation

## Overview

This is a full-stack URL shortener application that allows users to generate and manage shortened URLs. The system supports custom aliases, expiration, redirect tracking, and CRUD operations.

The stack includes a **FastAPI backend**, **React frontend**, **PostgreSQL** for persistence, and **Docker** for containerization.

---

## 1. Design Decisions and Tech Stack Rationale

### 1.1 Backend: FastAPI

**Why FastAPI?**
- Offers async support for handling high volumes of requests efficiently.
- Provides automatic API documentation through Swagger UI.
- Built-in request validation and serialization using Pydantic.
- Rapid development with type hints and modern Python support.
- Better performance than Flask in many benchmarks.

### 1.2 ORM: SQLAlchemy

**Why SQLAlchemy?**
- Well-supported and flexible ORM for Python.
- Integrates seamlessly with FastAPI.
- Allows complex relationships and migrations in PostgreSQL.

### 1.3 Database: PostgreSQL

**Why PostgreSQL?**
- Open-source, stable, and highly reliable RDBMS.
- Suited for structured data like short code, long URL mappings.
- Better relational capabilities than alternatives like SQLite.

### 1.4 Frontend: React + Vite

**Why React?**
- Popular, flexible frontend framework with a large ecosystem.
- Great component-based UI architecture for forms and result views.
- Works well with REST APIs.

**Why Vite?**
- Simple setup with minimal config
- Developer experience is superior to Create React App.

### 1.5 DevOps: Docker + Docker Compose

**Why Docker?**
- Containerization ensures consistent environments across systems.
- Easy to isolate backend, frontend, and database services.
- Enables full-stack development without installing dependencies natively.

**Why Docker Compose?**
- Simplifies orchestration of multi-container setups.
- One command to launch everything: backend, frontend, and DB.

---

## 2. Setup Instructions

1. Clone the repository:
```bash
git clone <repo-url>
cd url_shortener_fixed
```

2. Build and run all services:
```bash
docker-compose up --build
```

3. Access the services:
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

---

## 3. Usage Guide

### Create Short URL (POST `/shorten`)
```json
{
  "original_url": "https://example.com",
  "custom_alias": "myalias",
  "expiration": "2025-06-01T12:00:00"
}
```

### Redirect (GET `/{short_code}`)
- Redirects to original URL
- Tracks visit count
- Returns 410 for expired or 404 for missing

### Retrieve Info (GET `/shorten/{short_code}/info`)
- View original URL, expiration, visit count

### Update URL (PUT `/shorten/{short_code}`)
- Update long URL or expiration

### Delete URL (DELETE `/shorten/{short_code}`)
- Removes record from DB

---

## 4. Testing

To run automated backend tests:

```bash
docker-compose exec web pytest
```

Or run locally:
```bash
pip install pytest httpx
pytest -v
```

Covers:
- Shorten
- Redirect
- Expiration
- Update
- Delete
- Info lookup

---

## 5. Project Structure

```
url_shortener_fixed/
├── app/
│   ├── main.py
│   ├── crud.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
├── frontend/
│   └── src/App.jsx
├── tests/
│   └── test_urls.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

---

## 6. Tools used

```
- PyCharm
- Docker Desktop
- GenAI pluggins for debugging
```
