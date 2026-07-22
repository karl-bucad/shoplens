from fastapi import FastAPI

from app.api.routes.auth import router as auth_router
from app.core.config import get_settings


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="Backend API for the ShopLens analytics platform.",
    version=settings.app_version,
    debug=settings.debug,
)

app.include_router(auth_router)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": f"{settings.app_name} is running"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "healthy",
        "environment": settings.environment,
    }