from fastapi import FastAPI

app = FastAPI(
    title="ShopLens API",
    description="Backend API for the ShopLens analytics platform.",
    version="0.1.0",
)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "ShopLens API is running"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "healthy"}