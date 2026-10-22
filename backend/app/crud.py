from typing import Any, Optional, Sequence

from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload, selectinload

from . import models, schemas
from .errors import AppError, require


def changes(data: BaseModel) -> dict[str, Any]:
    return {key: value for key, value in data.model_dump(exclude_unset=True).items() if value is not None}


def get_categories(db: Session) -> Sequence[models.Category]:
    return db.scalars(select(models.Category).order_by(models.Category.name)).all()


def get_category(db: Session, category_id: int) -> Optional[models.Category]:
    return db.get(models.Category, category_id)


def ensure_category_name_free(db: Session, name: str, own_id: Optional[int] = None) -> None:
    query = select(models.Category).where(models.Category.name == name)
    existing = db.scalar(query)
    if existing is not None and existing.id != own_id:
        raise AppError(409, "Категория с таким названием уже существует")


def create_category(db: Session, data: schemas.CategoryCreate) -> models.Category:
    ensure_category_name_free(db, data.name)
    category = models.Category(**data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(
    db: Session, category: models.Category, data: schemas.CategoryUpdate
) -> models.Category:
    values = changes(data)
    if "name" in values:
        ensure_category_name_free(db, values["name"], category.id)
    for key, value in values.items():
        setattr(category, key, value)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category: models.Category) -> None:
    products_count = db.scalar(
        select(func.count()).select_from(models.Product).where(models.Product.category_id == category.id)
    )
    if products_count:
        raise AppError(409, "Нельзя удалить категорию, в которой есть товары")
    db.delete(category)
    db.commit()


def get_products(
    db: Session, category_id: Optional[int] = None, search: Optional[str] = None
) -> Sequence[models.Product]:
    query = select(models.Product).options(joinedload(models.Product.category))
    if category_id is not None:
        query = query.where(models.Product.category_id == category_id)
    if search:
        query = query.where(models.Product.name.ilike(f"%{search}%"))
    return db.scalars(query.order_by(models.Product.id)).all()


def get_product(db: Session, product_id: int) -> Optional[models.Product]:
    query = (
        select(models.Product)
        .options(joinedload(models.Product.category))
        .where(models.Product.id == product_id)
        .execution_options(populate_existing=True)
    )
    return db.scalar(query)


def ensure_category_exists(db: Session, category_id: int) -> None:
    require(db.get(models.Category, category_id), f"Категория с id={category_id} не найдена")


def create_product(db: Session, data: schemas.ProductCreate) -> models.Product:
    ensure_category_exists(db, data.category_id)
    product = models.Product(**data.model_dump())
    db.add(product)
    db.commit()
    return require(get_product(db, product.id), "Товар не найден")


def update_product(
    db: Session, product: models.Product, data: schemas.ProductUpdate
) -> models.Product:
    values = changes(data)
    if "category_id" in values:
        ensure_category_exists(db, values["category_id"])
    for key, value in values.items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return require(get_product(db, product.id), "Товар не найден")


def delete_product(db: Session, product: models.Product) -> None:
    used = db.scalar(
        select(func.count()).select_from(models.OrderItem).where(models.OrderItem.product_id == product.id)
    )
    if used:
        raise AppError(409, "Товар есть в заказах, поэтому его нельзя удалить")
    db.delete(product)
    db.commit()


def get_charities(db: Session, city: Optional[str] = None) -> Sequence[models.Charity]:
    query = select(models.Charity)
    if city:
        query = query.where(models.Charity.city.ilike(f"%{city}%"))
    return db.scalars(query.order_by(models.Charity.id)).all()


def get_charity(db: Session, charity_id: int) -> Optional[models.Charity]:
    return db.get(models.Charity, charity_id)


def create_charity(db: Session, data: schemas.CharityCreate) -> models.Charity:
    charity = models.Charity(**data.model_dump())
    db.add(charity)
    db.commit()
    db.refresh(charity)
    return charity


def update_charity(
    db: Session, charity: models.Charity, data: schemas.CharityUpdate
) -> models.Charity:
    for key, value in changes(data).items():
        setattr(charity, key, value)
    db.commit()
    db.refresh(charity)
    return charity


def delete_charity(db: Session, charity: models.Charity) -> None:
    donations_count = db.scalar(
        select(func.count()).select_from(models.Donation).where(models.Donation.charity_id == charity.id)
    )
    if donations_count:
        raise AppError(409, "Организация получала пожертвования, поэтому её нельзя удалить")
    db.delete(charity)
    db.commit()


def get_donation_summary(db: Session, charity_id: int) -> schemas.DonationSummary:
    count, total = db.execute(
        select(func.count(models.Donation.id), func.coalesce(func.sum(models.Donation.amount), 0)).where(
            models.Donation.charity_id == charity_id
        )
    ).one()
    return schemas.DonationSummary(charity_id=charity_id, donations_count=count, total_amount=total)


def order_query():
    return select(models.Order).options(
        selectinload(models.Order.items).selectinload(models.OrderItem.product),
        selectinload(models.Order.donation),
    )


def get_orders(db: Session) -> Sequence[models.Order]:
    return db.scalars(order_query().order_by(models.Order.id.desc())).all()


def get_order(db: Session, order_id: int) -> Optional[models.Order]:
    query = order_query().where(models.Order.id == order_id).execution_options(populate_existing=True)
    return db.scalar(query)


def update_order(db: Session, order: models.Order, data: schemas.OrderUpdate) -> models.Order:
    for key, value in changes(data).items():
        setattr(order, key, value)
    db.commit()
    return require(get_order(db, order.id), "Заказ не найден")


def delete_order(db: Session, order: models.Order) -> None:
    db.delete(order)
    db.commit()
