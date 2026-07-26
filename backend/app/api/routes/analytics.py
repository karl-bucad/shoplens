from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.schemas import (
    AnalyticsOverviewResponse,
    CategoryAnalyticsResponse,
    ShopAnalyticsResponse,
    ImportAnalyticsResponse,
)
from app.services import (
    get_analytics_overview,
    get_category_analytics,
    get_shop_analytics,
    get_import_analytics,
)


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
    
@router.get(
    "/categories",
    response_model=list[CategoryAnalyticsResponse],
)
def read_category_analytics(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_category_analytics(
        db=db,
        user_id=current_user.id,
    )
    
@router.get(
    "/shops",
    response_model=list[ShopAnalyticsResponse],
)
def read_shop_analytics(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_shop_analytics(
        db=db,
        user_id=current_user.id,
    )
    
@router.get(
    "/imports",
    response_model=list[ImportAnalyticsResponse],
)
def read_import_analytics(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_import_analytics(
        db=db,
        user_id=current_user.id,
    )