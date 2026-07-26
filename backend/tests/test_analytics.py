from fastapi.testclient import TestClient
from sqlalchemy import delete

from app.db.session import SessionLocal
from app.main import app
from app.models.import_job import ImportJob
from app.models.product import Product
from app.models.user import User


client = TestClient(app)

TEST_EMAIL = "analytics-test@shoplens.com"
TEST_PASSWORD = "password123"


def clear_test_data() -> None:
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == TEST_EMAIL).first()

        if user is not None:
            db.execute(delete(Product).where(Product.user_id == user.id))
            db.execute(delete(ImportJob).where(ImportJob.user_id == user.id))
            db.delete(user)
            db.commit()


def register_and_get_token() -> str:
    register_response = client.post(
        "/auth/register",
        json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/auth/login",
        data={
            "username": TEST_EMAIL,
            "password": TEST_PASSWORD,
        },
    )

    assert login_response.status_code == 200

    return login_response.json()["access_token"]


def test_authenticated_user_can_view_analytics_overview() -> None:
    clear_test_data()
    token = register_and_get_token()
    headers = {"Authorization": f"Bearer {token}"}

    first_response = client.post(
        "/products",
        headers=headers,
        json={
            "name": "Product One",
            "shop_name": "Shop One",
            "category": "Beauty",
        },
    )

    second_response = client.post(
        "/products",
        headers=headers,
        json={
            "name": "Product Two",
            "shop_name": "Shop One",
            "category": "Beauty",
        },
    )

    third_response = client.post(
        "/products",
        headers=headers,
        json={
            "name": "Product Three",
            "shop_name": "Shop Two",
            "category": "Fitness",
        },
    )

    assert first_response.status_code == 201
    assert second_response.status_code == 201
    assert third_response.status_code == 201

    import_response = client.post(
        "/imports/csv",
        headers=headers,
        files={
            "file": (
                "analytics-products.csv",
                "name,shop_name,category\n"
                "Product Four,Shop Three,Home\n",
                "text/csv",
            )
        },
    )

    assert import_response.status_code == 201

    response = client.get(
        "/analytics/overview",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total_products"] == 4
    assert data["total_shops"] == 3
    assert data["total_categories"] == 3
    assert data["latest_import"] is not None

    clear_test_data()


def test_empty_analytics_overview_returns_zero_counts() -> None:
    clear_test_data()
    token = register_and_get_token()

    response = client.get(
        "/analytics/overview",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total_products"] == 0
    assert data["total_shops"] == 0
    assert data["total_categories"] == 0
    assert data["latest_import"] is None

    clear_test_data()


def test_unauthenticated_user_cannot_view_analytics_overview() -> None:
    response = client.get("/analytics/overview")

    assert response.status_code == 401
    
def test_authenticated_user_can_view_category_analytics() -> None:
    clear_test_data()
    token = register_and_get_token()
    headers = {"Authorization": f"Bearer {token}"}

    client.post(
        "/products",
        headers=headers,
        json={
            "name": "Product One",
            "shop_name": "Shop One",
            "category": "Beauty",
        },
    )

    client.post(
        "/products",
        headers=headers,
        json={
            "name": "Product Two",
            "shop_name": "Shop Two",
            "category": "Beauty",
        },
    )

    client.post(
        "/products",
        headers=headers,
        json={
            "name": "Product Three",
            "shop_name": "Shop Three",
            "category": "Fitness",
        },
    )

    response = client.get(
        "/analytics/categories",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data == [
        {
            "category": "Beauty",
            "product_count": 2,
        },
        {
            "category": "Fitness",
            "product_count": 1,
        },
    ]

    clear_test_data()


def test_empty_category_analytics_returns_empty_list() -> None:
    clear_test_data()
    token = register_and_get_token()

    response = client.get(
        "/analytics/categories",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json() == []

    clear_test_data()


def test_unauthenticated_user_cannot_view_category_analytics() -> None:
    response = client.get("/analytics/categories")

    assert response.status_code == 401