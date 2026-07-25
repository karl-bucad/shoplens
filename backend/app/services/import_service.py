from sqlalchemy.orm import Session

from app.models.import_job import ImportJob, ImportStatus


def create_import_job(
    *,
    db: Session,
    user_id: int,
    filename: str,
) -> ImportJob:
    job = ImportJob(
        user_id=user_id,
        filename=filename,
        status=ImportStatus.PENDING,
    )

    db.add(job)
    db.flush()
    db.refresh(job)

    return job