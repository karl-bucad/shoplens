from app.api.routes.auth import router as auth_router
from app.api.routes.products import router as products_router
from .imports import router as imports_router

__all__ = ["auth_router", "products_router"]