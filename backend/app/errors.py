from typing import Optional, TypeVar

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

T = TypeVar("T")


class AppError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail


def require(obj: Optional[T], message: str) -> T:
    if obj is None:
        raise AppError(404, message)
    return obj


def translate(error: dict) -> str:
    kind = error["type"]
    ctx = error.get("ctx", {})
    if kind == "missing":
        return "Обязательное поле"
    if kind == "string_too_short":
        return f"Минимальная длина: {ctx.get('min_length')} симв."
    if kind == "string_too_long":
        return f"Максимальная длина: {ctx.get('max_length')} симв."
    if kind == "greater_than":
        return f"Значение должно быть больше {ctx.get('gt')}"
    if kind == "greater_than_equal":
        return f"Значение должно быть не меньше {ctx.get('ge')}"
    if kind == "less_than_equal":
        return f"Значение должно быть не больше {ctx.get('le')}"
    if kind in ("int_parsing", "int_type"):
        return "Нужно целое число"
    if kind in ("float_parsing", "float_type"):
        return "Нужно число"
    if kind == "too_short":
        return f"Минимальное количество элементов: {ctx.get('min_length')}"
    if kind == "literal_error":
        return "Недопустимое значение"
    if kind == "value_error":
        return str(error["msg"]).removeprefix("Value error, ")
    return str(error["msg"])


async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


async def validation_error_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    errors = [
        {
            "field": ".".join(str(part) for part in error["loc"][1:]),
            "message": translate(error),
        }
        for error in exc.errors()
    ]
    return JSONResponse(
        status_code=422,
        content={"detail": "Некорректные данные запроса", "errors": errors},
    )


async def integrity_error_handler(request: Request, exc: IntegrityError) -> JSONResponse:
    return JSONResponse(
        status_code=409,
        content={"detail": "Операция нарушает целостность данных в базе"},
    )
