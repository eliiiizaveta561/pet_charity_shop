from sqlalchemy import select
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .auth import is_admin
from .errors import AppError, require


def create_order(db: Session, data: schemas.OrderCreate, user: models.User) -> models.Order:
    quantities: dict[int, int] = {}
    for item in data.items:
        quantities[item.product_id] = quantities.get(item.product_id, 0) + item.quantity

    found = db.scalars(select(models.Product).where(models.Product.id.in_(quantities))).all()
    products = {product.id: product for product in found}
    missing = sorted(set(quantities) - set(products))
    if missing:
        ids = ", ".join(str(product_id) for product_id in missing)
        raise AppError(404, f"Товары не найдены: {ids}")

    order = models.Order(
        user_id=user.id,
        customer_name=data.customer_name,
        phone=data.phone,
        address=data.address,
    )
    for product_id, quantity in quantities.items():
        order.items.append(
            models.OrderItem(
                product_id=product_id,
                quantity=quantity,
                unit_price=products[product_id].price,
            )
        )

    if data.donation is not None:
        charity = require(
            db.get(models.Charity, data.donation.charity_id),
            f"Организация с id={data.donation.charity_id} не найдена",
        )
        order.donation = models.Donation(charity_id=charity.id, amount=data.donation.amount)

    db.add(order)
    db.commit()
    return require(crud.get_order(db, order.id), "Заказ не найден")


def check_order_access(order: models.Order, user: models.User) -> None:
    if not is_admin(user) and order.user_id != user.id:
        raise AppError(403, "Нет доступа к чужому заказу")


def update_order(
    db: Session, order: models.Order, data: schemas.OrderUpdate, user: models.User
) -> models.Order:
    check_order_access(order, user)
    # Покупатель может поправить контакты или отменить заказ, пока его не начали обрабатывать.
    # Остальные смены статуса делает администратор.
    if not is_admin(user):
        if order.status != "new":
            raise AppError(403, "Заказ уже в обработке, изменить его может только администратор")
        if data.status is not None and data.status != "cancelled":
            raise AppError(403, "Покупатель может только отменить заказ")
    return crud.update_order(db, order, data)


def check_review_author(review: models.Review, user: models.User) -> None:
    if review.user_id != user.id:
        raise AppError(403, "Изменять отзыв может только его автор")


def check_review_delete(review: models.Review, user: models.User) -> None:
    # Удалить отзыв может автор или администратор (модерация)
    if review.user_id != user.id and not is_admin(user):
        raise AppError(403, "Удалить отзыв может только автор или администратор")
