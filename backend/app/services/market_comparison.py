from collections import Counter

from sqlalchemy.orm import Session

from app.models.import_job import ImportJob, ImportStatus
from app.models.product import Product


def _percent_change(
    current: int,
    previous: int,
) -> float | None:
    if previous == 0:
        return None

    return round(
        ((current - previous) / previous) * 100,
        1,
    )


def get_market_comparison(
    *,
    db: Session,
    user_id: int,
):
    import_jobs = (
        db.query(ImportJob)
        .filter(
            ImportJob.user_id == user_id,
            ImportJob.status == ImportStatus.COMPLETED,
        )
        .order_by(ImportJob.created_at.desc())
        .limit(2)
        .all()
    )

    if len(import_jobs) < 2:
        return {
            "current_import_id": 0,
            "previous_import_id": 0,
            "products": {
                "current": 0,
                "previous": 0,
                "change": 0,
                "percent_change": None,
            },
            "shops": {
                "current": 0,
                "previous": 0,
                "change": 0,
                "percent_change": None,
            },
            "categories": {
                "current": 0,
                "previous": 0,
                "change": 0,
                "percent_change": None,
            },
            "category_trends": [],
            "new_shops": [],
            "removed_shops": [],
        }

    current_import = import_jobs[0]
    previous_import = import_jobs[1]

    current_products = (
        db.query(Product)
        .filter(
            Product.user_id == user_id,
            Product.import_job_id == current_import.id,
        )
        .all()
    )

    previous_products = (
        db.query(Product)
        .filter(
            Product.user_id == user_id,
            Product.import_job_id == previous_import.id,
        )
        .all()
    )

    current_shop_names = {
        product.shop_name
        for product in current_products
        if product.shop_name
    }

    previous_shop_names = {
        product.shop_name
        for product in previous_products
        if product.shop_name
    }

    current_categories = {
        product.category
        for product in current_products
        if product.category
    }

    previous_categories = {
        product.category
        for product in previous_products
        if product.category
    }

    current_category_counts = Counter(
        product.category
        for product in current_products
        if product.category
    )

    previous_category_counts = Counter(
        product.category
        for product in previous_products
        if product.category
    )

    category_names = sorted(
        set(current_category_counts)
        | set(previous_category_counts)
    )

    category_trends = []

    for category in category_names:
        current_count = current_category_counts.get(
            category,
            0,
        )

        previous_count = previous_category_counts.get(
            category,
            0,
        )

        category_trends.append(
            {
                "category": category,
                "current_count": current_count,
                "previous_count": previous_count,
                "change": (
                    current_count - previous_count
                ),
                "percent_change": _percent_change(
                    current_count,
                    previous_count,
                ),
            }
        )

    current_product_count = len(current_products)
    previous_product_count = len(previous_products)

    current_shop_count = len(current_shop_names)
    previous_shop_count = len(previous_shop_names)

    current_category_count = len(current_categories)
    previous_category_count = len(previous_categories)

    return {
        "current_import_id": current_import.id,
        "previous_import_id": previous_import.id,
        "products": {
            "current": current_product_count,
            "previous": previous_product_count,
            "change": (
                current_product_count
                - previous_product_count
            ),
            "percent_change": _percent_change(
                current_product_count,
                previous_product_count,
            ),
        },
        "shops": {
            "current": current_shop_count,
            "previous": previous_shop_count,
            "change": (
                current_shop_count
                - previous_shop_count
            ),
            "percent_change": _percent_change(
                current_shop_count,
                previous_shop_count,
            ),
        },
        "categories": {
            "current": current_category_count,
            "previous": previous_category_count,
            "change": (
                current_category_count
                - previous_category_count
            ),
            "percent_change": _percent_change(
                current_category_count,
                previous_category_count,
            ),
        },
        "category_trends": category_trends,
        "new_shops": sorted(
            current_shop_names - previous_shop_names
        ),
        "removed_shops": sorted(
            previous_shop_names - current_shop_names
        ),
    }