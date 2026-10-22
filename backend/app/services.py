from sqlalchemy import select
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .errors import AppError, require


def create_order(db: Session, data: schemas.OrderCreate) -> models.Order:
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
