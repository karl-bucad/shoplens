from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.schemas import AnalyticsOverviewResponse
from app.services import get_analytics_overview


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get(
    "/overview",
    response_model=AnalyticsOverviewResponse,
)
def read_analytics_overview(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_analytics_overview(
        db=db,
        user_id=current_user.id,
    )