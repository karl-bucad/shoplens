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

    job = create_import_job(
        user_id=current_user.id,
        filename=filename,
    )

    return {
        "import_job_id": job.id,
        "filename": job.filename,
        "status": job.status,
        "total_rows": len(rows),
    }