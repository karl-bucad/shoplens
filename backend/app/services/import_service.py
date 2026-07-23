from app.db.session import SessionLocal
from app.models.import_job import ImportJob, ImportStatus


def create_import_job(
    *,
    user_id: int,
    filename: str,
) -> ImportJob:
    db = SessionLocal()

    try:
        job = ImportJob(
            user_id=user_id,
            filename=filename,
            status=ImportStatus.PENDING,
        )

        db.add(job)
        db.commit()
        db.refresh(job)

        return job

    finally:
        db.close()