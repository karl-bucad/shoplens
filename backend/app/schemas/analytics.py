from datetime import datetime

from pydantic import BaseModel


class AnalyticsOverviewResponse(BaseModel):
    total_products: int
    total_shops: int
    total_categories: int
    latest_import: datetime | None
    
class CategoryAnalyticsResponse(BaseModel):
    category: str
    product_count: int