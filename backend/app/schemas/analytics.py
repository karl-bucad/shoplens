from datetime import date, datetime

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


class SnapshotMetricChange(BaseModel):
    current: int
    previous: int
    change: int
    percent_change: float | None


class CategoryTrendResponse(BaseModel):
    category: str
    current_count: int
    previous_count: int
    change: int
    percent_change: float | None


class MarketComparisonResponse(BaseModel):
    current_import_id: int
    previous_import_id: int

    products: SnapshotMetricChange
    shops: SnapshotMetricChange
    categories: SnapshotMetricChange

    category_trends: list[CategoryTrendResponse]

    new_shops: list[str]
    removed_shops: list[str]