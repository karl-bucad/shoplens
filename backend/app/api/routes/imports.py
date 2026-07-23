from fastapi import APIRouter, Depends, File, UploadFile

from app.api.dependencies import get_current_user

from app.services.import_service import create_import_job

router = APIRouter(
    prefix="/imports",
    tags=["Imports"],
)


@router.post("/csv", status_code=201)
async def upload_csv(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    job = create_import_job(
        user_id=current_user.id,
        filename=file.filename,
    )

    return {
        "import_job_id": job.id,
        "filename": job.filename,
        "status": job.status,
    }