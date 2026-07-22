from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.product import ProductCreate, ProductResponse
from app.services.product_service import (
    create_product,
    get_products_by_user,
)


router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProductResponse:
    return create_product(
        db=db,
        user_id=current_user.id,
        product_data=product_data,
    )


@router.get(
    "",
    response_model=list[ProductResponse],
)
def read_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ProductResponse]:
    return get_products_by_user(
        db=db,
        user_id=current_user.id,
    )