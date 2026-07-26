from datetime import datetime, date

from pydantic import BaseModel


class AnalyticsOverviewResponse(BaseModel):
    total_products: int
    total_shops: int
    total_categories: int
    latest_import: datetime | None
    
class CategoryAnalyticsResponse(BaseModel):
    category: str
    product_count: int
    
class ShopAnalyticsResponse(BaseModel):
    shop_name: str
    product_count: int
    
class ImportAnalyticsResponse(BaseModel):
    date: date
    import_count: int