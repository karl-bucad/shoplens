from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.import_job import ImportJob, ImportStatus
from app.models.product import Product


def import_products_from_rows(
    *,
    db: Session,
    rows: list[dict[str, str]],
    user_id: int,
    import_job: ImportJob,
) -> ImportJob:
    successful_rows = 0
    failed_rows = 0

    import_job.status = ImportStatus.PROCESSING
    import_job.total_rows = len(rows)

    for row in rows:
        name = row.get("name", "").strip()
        shop_name = row.get("shop_name", "").strip()
        category = row.get("category", "").strip()

        if not name:
            failed_rows += 1
            continue

        product = Product(
            user_id=user_id,
            name=name,
            shop_name=shop_name or None,
            category=category or None,
        )

        db.add(product)
        successful_rows += 1

    import_job.successful_rows = successful_rows
    import_job.failed_rows = failed_rows
    import_job.status = ImportStatus.COMPLETED
    import_job.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(import_job)

    return import_job