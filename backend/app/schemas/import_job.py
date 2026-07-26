from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ImportJobResponse(BaseModel):
    id: int
    filename: str
    status: str

    total_rows: int
    successful_rows: int
    failed_rows: int

    created_at: datetime
    completed_at: datetime | None

    model_config = ConfigDict(from_attributes=True)