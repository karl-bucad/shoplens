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


def test_authenticated_user_can_list_latest_snapshot_products() -> None:
    clear_test_data()

    token = register_and_get_token()
    headers = {"Authorization": f"Bearer {token}"}

    manual_response = client.post(
        "/products",
        headers=headers,
        json={
            "name": "Manual Product",
            "shop_name": "Manual Shop",
            "category": "Manual",
        },
    )

    assert manual_response.status_code == 201

    first_import = client.post(
        "/imports/csv",
        headers=headers,
        files={
            "file": (
                "first-snapshot.csv",
                "name,shop_name,category\n"
                "Old Product,Old Shop,Beauty\n",
                "text/csv",
            )
        },
    )

    assert first_import.status_code == 201

    second_import = client.post(
        "/imports/csv",
        headers=headers,
        files={
            "file": (
                "latest-snapshot.csv",
                "name,shop_name,category\n"
                "Latest Product One,Latest Shop,Home\n"
                "Latest Product Two,Latest Shop,Fitness\n",
                "text/csv",
            )
        },
    )

    assert second_import.status_code == 201

    response = client.get(
        "/products/latest",
        headers=headers,
    )

    assert response.status_code == 200

    products = response.json()

    assert len(products) == 2

    assert {
        product["name"]
        for product in products
    } == {
        "Latest Product One",
        "Latest Product Two",
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
    
def test_authenticated_user_can_update_product() -> None:
    clear_test_data()
    token = register_and_get_token()
    headers = {"Authorization": f"Bearer {token}"}

    create_response = client.post(
        "/products",
        headers=headers,
        json={
            "name": "Original Product",
            "shop_name": "Original Shop",
            "category": "Original Category",
        },
    )

    assert create_response.status_code == 201

    product_id = create_response.json()["id"]

    update_response = client.put(
        f"/products/{product_id}",
        headers=headers,
        json={
            "name": "Updated Product",
            "shop_name": "Updated Shop",
            "category": "Updated Category",
        },
    )

    assert update_response.status_code == 200

    data = update_response.json()

    assert data["id"] == product_id
    assert data["name"] == "Updated Product"
    assert data["shop_name"] == "Updated Shop"
    assert data["category"] == "Updated Category"

    clear_test_data()


def test_updating_missing_product_returns_not_found() -> None:
    clear_test_data()
    token = register_and_get_token()

    response = client.put(
        "/products/999999",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Missing Product",
        },
    )

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Product not found."
    }

    clear_test_data()
    
def test_authenticated_user_can_delete_product() -> None:
    clear_test_data()
    token = register_and_get_token()
    headers = {"Authorization": f"Bearer {token}"}

    create_response = client.post(
        "/products",
        headers=headers,
        json={
            "name": "Delete Test Product",
            "shop_name": "Test Shop",
            "category": "Testing",
        },
    )

    assert create_response.status_code == 201

    product_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/products/{product_id}",
        headers=headers,
    )

    assert delete_response.status_code == 204

    list_response = client.get(
        "/products",
        headers=headers,
    )

    assert list_response.status_code == 200
    assert all(
        product["id"] != product_id
        for product in list_response.json()
    )

    clear_test_data()


def test_deleting_missing_product_returns_not_found() -> None:
    clear_test_data()
    token = register_and_get_token()

    response = client.delete(
        "/products/999999",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Product not found."
    }

    clear_test_data()