import re
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

OrderStatus = Literal["new", "paid", "shipped", "cancelled"]
Role = Literal["customer", "admin"]

EMAIL_PATTERN = re.compile(r"[^@\s]+@[^@\s]+\.[^@\s]+")


def normalize_phone(value: str) -> str:
    text = value.strip()
    if not re.fullmatch(r"\+?[\d\s()\-]+", text):
        raise ValueError("Телефон может содержать только цифры, пробелы, скобки, дефис и знак + в начале")
    digits = re.sub(r"\D", "", text)
    if len(digits) != 11 or digits[0] not in "78" or (text.startswith("+") and digits[0] != "7"):
        raise ValueError("Номер должен состоять из 11 цифр и начинаться с +7, 7 или 8")
    return "+7" + digits[1:]


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


def normalize_email(value: str) -> str:
    email = value.strip().lower()
    if not EMAIL_PATTERN.fullmatch(email):
        raise ValueError("Введите адрес почты в формате name@example.ru")
    return email


class RegisterRequest(BaseModel):
    email: str = Field(max_length=254)
    name: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def check_email(cls, value: str) -> str:
        return normalize_email(value)

    @field_validator("password")
    @classmethod
    def check_password(cls, value: str) -> str:
        if not re.search(r"[A-Za-zА-Яа-яЁё]", value) or not re.search(r"\d", value):
            raise ValueError("Пароль должен содержать хотя бы одну букву и одну цифру")
        return value


class LoginRequest(BaseModel):
    email: str = Field(max_length=254)
    password: str = Field(min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def lower_email(cls, value: str) -> str:
        return value.strip().lower()


class UserRead(ORMModel):
    id: int
    email: str
    name: str
    role: Role


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserRead


class CategoryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=100)


class CategoryRead(ORMModel):
    id: int
    name: str


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    brand: str = Field(min_length=1, max_length=100)
    description: str = Field(default="", max_length=2000)
    price: int = Field(gt=0, le=10_000_000)
    emoji: str = Field(default="🐾", min_length=1, max_length=16)
    category_id: int


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=200)
    brand: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=2000)
    price: Optional[int] = Field(default=None, gt=0, le=10_000_000)
    emoji: Optional[str] = Field(default=None, min_length=1, max_length=16)
    category_id: Optional[int] = None


class ProductRead(ORMModel):
    id: int
    name: str
    brand: str
    description: str
    price: int
    emoji: str
    category: CategoryRead


class CharityCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    city: str = Field(min_length=2, max_length=100)
    address: str = Field(min_length=2, max_length=200)
    description: str = Field(default="", max_length=2000)
    need: str = Field(default="", max_length=200)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)


class CharityUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=200)
    city: Optional[str] = Field(default=None, min_length=2, max_length=100)
    address: Optional[str] = Field(default=None, min_length=2, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    need: Optional[str] = Field(default=None, max_length=200)
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)


class CharityRead(ORMModel):
    id: int
    name: str
    city: str
    address: str
    description: str
    need: str
    latitude: float
    longitude: float


class DonationSummary(BaseModel):
    charity_id: int
    donations_count: int
    total_amount: int


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(ge=1, le=100)


class DonationCreate(BaseModel):
    charity_id: int
    amount: int = Field(gt=0, le=1_000_000)


class OrderCreate(BaseModel):
    customer_name: str = Field(min_length=2, max_length=100)
    phone: str
    address: str = Field(min_length=5, max_length=500)
    items: list[OrderItemCreate] = Field(min_length=1)
    donation: Optional[DonationCreate] = None

    @field_validator("phone")
    @classmethod
    def check_phone(cls, value: str) -> str:
        return normalize_phone(value)


class OrderUpdate(BaseModel):
    customer_name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    phone: Optional[str] = None
    address: Optional[str] = Field(default=None, min_length=5, max_length=500)
    status: Optional[OrderStatus] = None

    @field_validator("phone")
    @classmethod
    def check_phone(cls, value: Optional[str]) -> Optional[str]:
        return normalize_phone(value) if value is not None else None


class OrderItemRead(ORMModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: int


class DonationRead(ORMModel):
    id: int
    charity_id: int
    charity_name: str
    amount: int


class OrderRead(ORMModel):
    id: int
    user_id: int
    customer_name: str
    phone: str
    address: str
    status: str
    created_at: datetime
    items: list[OrderItemRead]
    donation: Optional[DonationRead]
    items_total: int
    donation_total: int
    total: int


class ReviewCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    text: str = Field(min_length=10, max_length=500)


class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    text: Optional[str] = Field(default=None, min_length=10, max_length=500)


class ReviewRead(ORMModel):
    id: int
    product_id: int
    user_id: int
    author: str
    rating: int
    text: str
    created_at: datetime
