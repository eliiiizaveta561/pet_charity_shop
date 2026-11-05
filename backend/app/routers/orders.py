from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from .. import crud, schemas, services
from ..database import get_db
from ..errors import require

router = APIRouter(prefix="/orders", tags=["Заказы"])

NOT_FOUND = "Заказ не найден"


@router.get("", response_model=list[schemas.OrderRead])
def list_orders(db: Session = Depends(get_db)):
    return crud.get_orders(db)


@router.get("/{order_id}", response_model=schemas.OrderRead)
def read_order(order_id: int, db: Session = Depends(get_db)):
    return require(crud.get_order(db, order_id), NOT_FOUND)


@router.post("", response_model=schemas.OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(data: schemas.OrderCreate, db: Session = Depends(get_db)):
    return services.create_order(db, data)


@router.patch("/{order_id}", response_model=schemas.OrderRead)
def update_order(order_id: int, data: schemas.OrderUpdate, db: Session = Depends(get_db)):
    order = require(crud.get_order(db, order_id), NOT_FOUND)
    return crud.update_order(db, order, data)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = require(crud.get_order(db, order_id), NOT_FOUND)
    crud.delete_order(db, order)
