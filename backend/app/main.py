from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError

from .config import settings
from .errors import (
    AppError,
    app_error_handler,
    integrity_error_handler,
    validation_error_handler,
)
from .routers import categories, charities, orders, products

app = FastAPI(
    title="Добромаркет - API",
    description="Backend интернет-магазина товаров для животных с благотворительными пожертвованиями.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AppError, app_error_handler)
app.add_exception_handler(RequestValidationError, validation_error_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)

app.include_router(categories.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(charities.router, prefix="/api")
app.include_router(orders.router, prefix="/api")


@app.get("/api/health", tags=["Служебное"])
def health():
    return {"status": "ok"}
