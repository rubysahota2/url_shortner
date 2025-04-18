from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("test_urls.py was loaded")

def test_shorten_url():
    response = client.post("/shorten", json={"original_url": "https://example.com"})
    assert response.status_code == 200
    data = response.json()
    assert "short_url" in data
    assert "short_code" in data

def test_lookup_info():

    response = client.post("/shorten", json={"original_url": "https://mywebsite.com"})
    short_code = response.json()["short_code"]


    response = client.get(f"/shorten/{short_code}/info")
    assert response.status_code == 200
    assert response.json()["original_url"] == "https://mywebsite.com"

def test_update_url():
    response = client.post("/shorten", json={"original_url": "https://google.com"})
    short_code = response.json()["short_code"]


    update = client.put(f"/shorten/{short_code}", json={"original_url": "https://updated.com"})
    assert update.status_code == 200
    assert "updated" in update.json()["message"].lower()


    check = client.get(f"/shorten/{short_code}/info")
    assert check.json()["original_url"] == "https://updated.com"

def test_delete_url():
    response = client.post("/shorten", json={"original_url": "https://delete-me.com"})
    short_code = response.json()["short_code"]

    delete = client.delete(f"/shorten/{short_code}")
    assert delete.status_code == 200
    assert "deleted" in delete.json()["message"].lower()

    # Try to get it again
    check = client.get(f"/shorten/{short_code}/info")
    assert check.status_code == 404

def test_invalid_lookup():
    response = client.get("/shorten/nonexistent/info")
    assert response.status_code == 404


def test_visit_tracking():
    create = client.post("/shorten", json={"original_url": "https://trackme.com"})
    assert create.status_code == 200
    short_code = create.json()["short_code"]

    info = client.get(f"/shorten/{short_code}/info")
    assert info.status_code == 200
    assert info.json()["visits"] == 0

    response = client.request("GET", f"/{short_code}", follow_redirects=False)
    assert response.status_code in [302, 307]

    updated_info = client.get(f"/shorten/{short_code}/info")
    assert updated_info.status_code == 200
    assert updated_info.json()["visits"] == 1