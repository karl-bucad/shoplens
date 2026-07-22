from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate


def create_product(
    db: Session,
    user_id: int,
    product_data: ProductCreate,
) -> Product:
    product = Product(
        user_id=user_id,
        name=product_data.name,
        shop_name=product_data.shop_name,
        category=product_data.category,
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


def get_products_by_user(
    db: Session,
    user_id: int,
) -> list[Product]:
    statement = (
        select(Product)
        .where(Product.user_id == user_id)
        .order_by(Product.created_at.desc())
    )

    return list(db.scalars(statement).all())