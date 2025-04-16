#  URL Shortener (FastAPI + PostgreSQL + Docker)

This is a lightweight, containerized URL shortener service built using **FastAPI**, **PostgreSQL**, and **Docker**. It allows users to shorten long URLs, optionally customize the alias, and track the number of visits.

---

##  Features

-  Shorten long URLs
- Custom short aliases 
- Expiration support
- Visit tracking (count)
- Dockerized deployment 
- Swagger UI for easy testing

---

##  Tech Stack

- FastAPI
- PostgreSQL
- SQLAlchemy
- Docker & Docker Compose

---

##  Setup Instructions

### 1. Clone & Navigate
```bash
unzip url_shortener_fixed.zip
cd url_shortener_fixed
```

### 2. Start the Project with Docker
```bash
docker-compose up --build
```

### 3. Open in Browser
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

---

##  API Usage

### ▶️ POST `/shorten`
Create a new shortened URL.

#### Request JSON:
```json
{
  "original_url": "https://example.com/very/long/url",
  "custom_alias": "myalias",             // Optional
  "expiration": "2025-06-01T12:00:00"    // Optional
}
```

#### Response:
```json
{
  "short_url": "http://localhost:8000/myalias",
  "short_code": "myalias",
  "original_url": "https://example.com/very/long/url",
  "created_at": "...",
  "expiration": null,
  "visits": 0
}
```

### ▶️ GET `/{short_code}`
Redirects to the original long URL.



---

## 📁 Project Structure

```
url_shortener_fixed/
├── app/
│   ├── main.py
│   ├── crud.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── __init__.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```


