from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.exc import IntegrityError

from .config import settings
from .errors import (
    AppError,
    app_error_handler,
    integrity_error_handler,
    validation_error_handler,
)
from .routers import auth, categories, charities, orders, products, reviews

app = FastAPI(
    title="Добромаркет - API",
    description="Backend интернет-магазина товаров для животных с благотворительными пожертвованиями.",
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    # Нужно, чтобы браузер принимал и отправлял cookie с refresh token
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AppError, app_error_handler)
app.add_exception_handler(RequestValidationError, validation_error_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)

app.include_router(auth.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(charities.router, prefix="/api")
app.include_router(orders.router, prefix="/api")


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse("/docs")


@app.get("/api/health", tags=["Служебное"])
def health():
    return {"status": "ok"}
