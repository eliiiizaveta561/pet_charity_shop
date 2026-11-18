from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas, services
from ..auth import get_current_user, is_admin, require_admin
from ..database import get_db
from ..errors import require

router = APIRouter(prefix="/orders", tags=["Заказы"])

NOT_FOUND = "Заказ не найден"


@router.get("", response_model=list[schemas.OrderRead])
def list_orders(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Администратор видит все заказы, покупатель - только свои
    return crud.get_orders(db, None if is_admin(user) else user.id)


@router.get("/{order_id}", response_model=schemas.OrderRead)
def read_order(
    order_id: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    order = require(crud.get_order(db, order_id), NOT_FOUND)
    services.check_order_access(order, user)
    return order


@router.post("", response_model=schemas.OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(
    data: schemas.OrderCreate, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return services.create_order(db, data, user)


@router.patch("/{order_id}", response_model=schemas.OrderRead)
def update_order(
    order_id: int,
    data: schemas.OrderUpdate,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order = require(crud.get_order(db, order_id), NOT_FOUND)
    return services.update_order(db, order, data, user)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = require(crud.get_order(db, order_id), NOT_FOUND)
    crud.delete_order(db, order)
