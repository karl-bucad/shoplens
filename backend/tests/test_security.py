from app.core.security import hash_password, verify_password

from jose import jwt

from app.core.config import get_settings
from app.core.security import create_access_token

def test_hash_password_does_not_return_plain_password() -> None:
    password = "super-secret-password"

    hashed_password = hash_password(password)

    assert hashed_password != password


def test_verify_password_returns_true_for_correct_password() -> None:
    password = "super-secret-password"
    hashed_password = hash_password(password)

    assert verify_password(password, hashed_password) is True


def test_verify_password_returns_false_for_incorrect_password() -> None:
    hashed_password = hash_password("correct-password")

    assert verify_password("wrong-password", hashed_password) is False
    
def test_create_access_token_contains_subject() -> None:
    settings = get_settings()

    token = create_access_token(subject="123")

    payload = jwt.decode(
        token,
        settings.secret_key,
        algorithms=["HS256"],
    )

    assert payload["sub"] == "123"
    assert "exp" in payload