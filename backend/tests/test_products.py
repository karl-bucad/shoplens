from fastapi.testclient import TestClient
from sqlalchemy import delete

from app.db.session import SessionLocal
from app.main import app
from app.models.product import Product
from app.models.user import User


client = TestClient(app)

TEST_EMAIL = "products-test@shoplens.com"
TEST_PASSWORD = "password123"


def clear_test_data() -> None:
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == TEST_EMAIL).first()

        if user is not None:
            db.execute(delete(Product).where(Product.user_id == user.id))
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


def test_authenticated_user_can_create_product() -> None:
    clear_test_data()
    token = register_and_get_token()

    response = client.post(
        "/products",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Viral LED Strip Lights",
            "shop_name": "GlowTech",
            "category": "Home",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Viral LED Strip Lights"
    assert data["shop_name"] == "GlowTech"
    assert data["category"] == "Home"
    assert "id" in data
    assert "user_id" in data
    assert "created_at" in data

    clear_test_data()


def test_authenticated_user_can_list_products() -> None:
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
            "category": "Fitness",
        },
    )

    response = client.get(
        "/products",
        headers=headers,
    )

    assert response.status_code == 200

    products = response.json()

    assert len(products) == 2
    assert {product["name"] for product in products} == {
        "Product One",
        "Product Two",
    }

    clear_test_data()


def test_unauthenticated_user_cannot_access_products() -> None:
    create_response = client.post(
        "/products",
        json={
            "name": "Unauthorized Product",
            "shop_name": "Unknown Shop",
            "category": "Other",
        },
    )

    list_response = client.get("/products")

    assert create_response.status_code == 401
    assert list_response.status_code == 401