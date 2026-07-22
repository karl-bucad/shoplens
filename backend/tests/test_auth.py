from fastapi.testclient import TestClient
from sqlalchemy import delete

from app.db.session import SessionLocal
from app.main import app
from app.models.user import User


client = TestClient(app)


def clear_test_user() -> None:
    with SessionLocal() as db:
        db.execute(delete(User).where(User.email == "test-auth@shoplens.com"))
        db.commit()


def test_register_user() -> None:
    clear_test_user()

    response = client.post(
        "/auth/register",
        json={
            "email": "test-auth@shoplens.com",
            "password": "password123",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == "test-auth@shoplens.com"
    assert "id" in data
    assert "created_at" in data
    assert "hashed_password" not in data

    clear_test_user()


def test_register_duplicate_email_returns_conflict() -> None:
    clear_test_user()

    payload = {
        "email": "test-auth@shoplens.com",
        "password": "password123",
    }

    first_response = client.post("/auth/register", json=payload)
    second_response = client.post("/auth/register", json=payload)

    assert first_response.status_code == 201
    assert second_response.status_code == 409
    assert second_response.json() == {
        "detail": "A user with this email already exists."
    }

    clear_test_user()