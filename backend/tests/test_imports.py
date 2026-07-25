from fastapi.testclient import TestClient
from sqlalchemy import delete

from app.db.session import SessionLocal
from app.main import app
from app.models.import_job import ImportJob
from app.models.user import User
from app.models.product import Product


client = TestClient(app)

TEST_EMAIL = "imports-test@shoplens.com"
TEST_PASSWORD = "password123"


def clear_test_data() -> None:
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == TEST_EMAIL).first()

        if user is not None:
            db.execute(
                delete(ImportJob).where(ImportJob.user_id == user.id)
            )
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


def test_authenticated_user_can_upload_csv() -> None:
    clear_test_data()
    token = register_and_get_token()

    response = client.post(
        "/imports/csv",
        headers={"Authorization": f"Bearer {token}"},
        files={
            "file": (
                "products.csv",
                "name,shop_name,category\n"
                "LED Strip Lights,GlowTech,Home\n",
                "text/csv",
            )
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["filename"] == "products.csv"
    assert data["status"] == "completed"
    assert data["total_rows"] == 1
    assert data["successful_rows"] == 1
    assert data["failed_rows"] == 0
    assert "import_job_id" in data
    
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == TEST_EMAIL).first()

        assert user is not None

        products = (
            db.query(Product)
            .filter(Product.user_id == user.id)
            .all()
        )

        assert len(products) == 1
        assert products[0].name == "LED Strip Lights"
        assert products[0].shop_name == "GlowTech"
        assert products[0].category == "Home"

    clear_test_data()


def test_non_csv_file_is_rejected() -> None:
    clear_test_data()
    token = register_and_get_token()

    response = client.post(
        "/imports/csv",
        headers={"Authorization": f"Bearer {token}"},
        files={
            "file": (
                "products.txt",
                "This is not a CSV file.",
                "text/plain",
            )
        },
    )

    assert response.status_code == 400
    assert response.json() == {
        "detail": "Only CSV files are allowed."
    }

    clear_test_data()


def test_unauthenticated_user_cannot_upload_csv() -> None:
    response = client.post(
        "/imports/csv",
        files={
            "file": (
                "products.csv",
                "name,shop_name,category\n"
                "LED Strip Lights,GlowTech,Home\n",
                "text/csv",
            )
        },
    )

    assert response.status_code == 401
    
def test_csv_import_tracks_failed_rows() -> None:
    clear_test_data()
    token = register_and_get_token()

    response = client.post(
        "/imports/csv",
        headers={"Authorization": f"Bearer {token}"},
        files={
            "file": (
                "products.csv",
                "name,shop_name,category\n"
                "LED Strip Lights,GlowTech,Home\n"
                ",Missing Name Shop,Fitness\n",
                "text/csv",
            )
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["status"] == "completed"
    assert data["total_rows"] == 2
    assert data["successful_rows"] == 1
    assert data["failed_rows"] == 1

    with SessionLocal() as db:
        user = db.query(User).filter(User.email == TEST_EMAIL).first()

        assert user is not None

        products = (
            db.query(Product)
            .filter(Product.user_id == user.id)
            .all()
        )

        assert len(products) == 1
        assert products[0].name == "LED Strip Lights"

    clear_test_data()