from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import ImportJob, Product


def get_analytics_overview(
    *,
    db: Session,
    user_id: int,
) -> dict[str, int | datetime | None]:
    total_products = (
        db.query(func.count(Product.id))
        .filter(Product.user_id == user_id)
        .scalar()
    )

    total_shops = (
        db.query(func.count(func.distinct(Product.shop_name)))
        .filter(
            Product.user_id == user_id,
            Product.shop_name.isnot(None),
        )
        .scalar()
    )

    total_categories = (
        db.query(func.count(func.distinct(Product.category)))
        .filter(
            Product.user_id == user_id,
            Product.category.isnot(None),
        )
        .scalar()
    )

    latest_import = (
        db.query(func.max(ImportJob.created_at))
        .filter(ImportJob.user_id == user_id)
        .scalar()
    )

    return {
        "total_products": total_products or 0,
        "total_shops": total_shops or 0,
        "total_categories": total_categories or 0,
        "latest_import": latest_import,
    }
    
def get_category_analytics(
    *,
    db: Session,
    user_id: int,
) -> list[dict[str, str | int]]:
    rows = (
        db.query(
            Product.category,
            func.count(Product.id).label("product_count"),
        )
        .filter(
            Product.user_id == user_id,
            Product.category.isnot(None),
        )
        .group_by(Product.category)
        .order_by(func.count(Product.id).desc())
        .all()
    )

    return [
        {
            "category": category,
            "product_count": product_count,
        }
        for category, product_count in rows
    ]

def get_shop_analytics(
    *,
    db: Session,
    user_id: int,
) -> list[dict[str, str | int]]:
    rows = (
        db.query(
            Product.shop_name,
            func.count(Product.id).label("product_count"),
        )
        .filter(
            Product.user_id == user_id,
            Product.shop_name.isnot(None),
        )
        .group_by(Product.shop_name)
        .order_by(func.count(Product.id).desc())
        .all()
    )

    return [
        {
            "shop_name": shop_name,
            "product_count": product_count,
        }
        for shop_name, product_count in rows
    ]