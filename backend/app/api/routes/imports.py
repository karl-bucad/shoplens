from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)

from app.api.dependencies import get_current_user

from app.services.import_service import create_import_job

from app.services import create_import_job, parse_product_csv

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services import (
    create_import_job,
    import_products_from_rows,
    parse_product_csv,
)

from app.models.import_job import ImportJob
from app.schemas import ImportJobResponse

router = APIRouter(
    prefix="/imports",
    tags=["Imports"],
)

ALLOWED_CSV_CONTENT_TYPES = {
    "text/csv",
    "application/csv",
    "application/vnd.ms-excel",
}

@router.post("/csv", status_code=status.HTTP_201_CREATED)
async def upload_csv(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    filename = file.filename or ""

    if not filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV files are allowed.",
        )

    if file.content_type not in ALLOWED_CSV_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file must have a CSV content type.",
        )

    rows = await parse_product_csv(file)

    try:
        job = create_import_job(
            db=db,
            user_id=current_user.id,
            filename=filename,
        )

        completed_job = import_products_from_rows(
            db=db,
            rows=rows,
            user_id=current_user.id,
            import_job=job,
        )

    except Exception:
        db.rollback()
        raise

    return {
        "import_job_id": completed_job.id,
        "filename": completed_job.filename,
        "status": completed_job.status,
        "total_rows": completed_job.total_rows,
        "successful_rows": completed_job.successful_rows,
        "failed_rows": completed_job.failed_rows,
    }
    
@router.get(
    "",
    response_model=list[ImportJobResponse],
)
def list_import_jobs(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(ImportJob)
        .filter(ImportJob.user_id == current_user.id)
        .order_by(ImportJob.created_at.desc())
        .all()
    )