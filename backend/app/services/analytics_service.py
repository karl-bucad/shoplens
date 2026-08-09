from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.import_job import ImportJob, ImportStatus
from app.models.product import Product


def _get_latest_completed_import(
    *,
    db: Session,
    user_id: int,
) -> ImportJob | None:
    return (
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


def get_analytics_overview(
    *,
    db: Session,
    user_id: int,
) -> dict[str, int | datetime | None]:
    latest_import = _get_latest_completed_import(
        db=db,
        user_id=user_id,
    )

    if latest_import is None:
        return {
            "total_products": 0,
            "total_shops": 0,
            "total_categories": 0,
            "latest_import": None,
        }

    total_products = (
        db.query(func.count(Product.id))
        .filter(
            Product.user_id == user_id,
            Product.import_job_id == latest_import.id,
        )
        .scalar()
    )

    total_shops = (
        db.query(
            func.count(
                func.distinct(Product.shop_name)
            )
        )
        .filter(
            Product.user_id == user_id,
            Product.import_job_id == latest_import.id,
            Product.shop_name.isnot(None),
        )
        .scalar()
    )

    total_categories = (
        db.query(
            func.count(
                func.distinct(Product.category)
            )
        )
        .filter(
            Product.user_id == user_id,
            Product.import_job_id == latest_import.id,
            Product.category.isnot(None),
        )
        .scalar()
    )

    return {
        "total_products": total_products or 0,
        "total_shops": total_shops or 0,
        "total_categories": total_categories or 0,
        "latest_import": latest_import.created_at,
    }


def get_category_analytics(
    *,
    db: Session,
    user_id: int,
) -> list[dict[str, str | int]]:
    latest_import = _get_latest_completed_import(
        db=db,
        user_id=user_id,
    )

    if latest_import is None:
        return []

    rows = (
        db.query(
            Product.category,
            func.count(Product.id).label(
                "product_count"
            ),
        )
        .filter(
            Product.user_id == user_id,
            Product.import_job_id == latest_import.id,
            Product.category.isnot(None),
        )
        .group_by(Product.category)
        .order_by(
            func.count(Product.id).desc(),
            Product.category.asc(),
        )
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
    latest_import = _get_latest_completed_import(
        db=db,
        user_id=user_id,
    )

    if latest_import is None:
        return []

    rows = (
        db.query(
            Product.shop_name,
            func.count(Product.id).label(
                "product_count"
            ),
        )
        .filter(
            Product.user_id == user_id,
            Product.import_job_id == latest_import.id,
            Product.shop_name.isnot(None),
        )
        .group_by(Product.shop_name)
        .order_by(
            func.count(Product.id).desc(),
            Product.shop_name.asc(),
        )
        .all()
    )

    return [
        {
            "shop_name": shop_name,
            "product_count": product_count,
        }
        for shop_name, product_count in rows
    ]


def get_import_analytics(
    *,
    db: Session,
    user_id: int,
) -> list[dict[str, object]]:
    import_date = func.date(ImportJob.created_at)

    rows = (
        db.query(
            import_date.label("date"),
            func.count(ImportJob.id).label(
                "import_count"
            ),
        )
        .filter(ImportJob.user_id == user_id)
        .group_by(import_date)
        .order_by(import_date.asc())
        .all()
    )

    return [
        {
            "date": import_day,
            "import_count": import_count,
        }
        for import_day, import_count in rows
    ]