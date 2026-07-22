from fastapi.testclient import TestClient
from app.core.config import get_settings

from app.main import app

client = TestClient(app)


def test_read_root() -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "ShopLens API is running"}


def test_health_check() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "environment": "development",
    }

def test_settings_database_url() -> None:
    settings = get_settings()

    assert settings.database_url.startswith("postgresql+psycopg://")