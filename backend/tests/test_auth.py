def test_register_creates_user(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "testpass123", "full_name": "Test User"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"
    assert "id" in data
    # Password must never be echoed back
    assert "password" not in data
    assert "hashed_password" not in data


def test_register_duplicate_email_rejected(client):
    payload = {"email": "dupe@example.com", "password": "testpass123"}
    first = client.post("/api/auth/register", json=payload)
    assert first.status_code == 201

    second = client.post("/api/auth/register", json=payload)
    assert second.status_code == 400


def test_login_with_correct_credentials(client):
    client.post(
        "/api/auth/register",
        json={"email": "login@example.com", "password": "correctpass"},
    )
    response = client.post(
        "/api/auth/login",
        data={"username": "login@example.com", "password": "correctpass"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_with_wrong_password_rejected(client):
    client.post(
        "/api/auth/register",
        json={"email": "wrongpass@example.com", "password": "correctpass"},
    )
    response = client.post(
        "/api/auth/login",
        data={"username": "wrongpass@example.com", "password": "wrongpass"},
    )
    assert response.status_code == 401


def test_protected_route_requires_token(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_protected_route_works_with_valid_token(client):
    client.post(
        "/api/auth/register",
        json={"email": "protected@example.com", "password": "testpass123"},
    )
    login_resp = client.post(
        "/api/auth/login",
        data={"username": "protected@example.com", "password": "testpass123"},
    )
    token = login_resp.json()["access_token"]

    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "protected@example.com"