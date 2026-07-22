from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    shop_name: str | None = Field(default=None, max_length=255)
    category: str | None = Field(default=None, max_length=255)


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    name: str
    shop_name: str | None
    category: str | None
    created_at: datetime