from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from app.models.import_job import ImportJob, ImportStatus


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

def get_latest_products_by_user(
    db: Session,
    user_id: int,
) -> list[Product]:
    latest_import = (
        db.query(ImportJob)
        .filter(
            ImportJob.user_id == user_id,
            ImportJob.status == ImportStatus.COMPLETED,
        )
        .order_by(
            ImportJob.created_at.desc(),
            ImportJob.id.desc(),
        )
        .first()
    )

    if latest_import is None:
        return []

    statement = (
        select(Product)
        .where(
            Product.user_id == user_id,
            Product.import_job_id == latest_import.id,
        )
        .order_by(Product.created_at.desc())
    )

    return list(db.scalars(statement).all())


def update_product(
    db: Session,
    user_id: int,
    product_id: int,
    product_data: ProductUpdate,
) -> Product | None:
    statement = select(Product).where(
        Product.id == product_id,
        Product.user_id == user_id,
    )

    product = db.scalar(statement)

    if product is None:
        return None

    update_data = product_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return product

def delete_product(
    db: Session,
    user_id: int,
    product_id: int,
) -> bool:
    statement = select(Product).where(
        Product.id == product_id,
        Product.user_id == user_id,
    )

    product = db.scalar(statement)

    if product is None:
        return False

    db.delete(product)
    db.commit()

    return True