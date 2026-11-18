from typing import Optional

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..auth import require_admin
from ..database import get_db
from ..errors import require

router = APIRouter(prefix="/products", tags=["Товары"])

NOT_FOUND = "Товар не найден"
# Изменять каталог может только администратор, читать - все
ADMIN_ONLY = [Depends(require_admin)]


@router.get("", response_model=list[schemas.ProductRead])
def list_products(
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return crud.get_products(db, category_id, search)


@router.get("/{product_id}", response_model=schemas.ProductRead)
def read_product(product_id: int, db: Session = Depends(get_db)):
    return require(crud.get_product(db, product_id), NOT_FOUND)


@router.post("", response_model=schemas.ProductRead, status_code=status.HTTP_201_CREATED, dependencies=ADMIN_ONLY)
def create_product(data: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, data)


@router.patch("/{product_id}", response_model=schemas.ProductRead, dependencies=ADMIN_ONLY)
def update_product(product_id: int, data: schemas.ProductUpdate, db: Session = Depends(get_db)):
    product = require(crud.get_product(db, product_id), NOT_FOUND)
    return crud.update_product(db, product, data)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=ADMIN_ONLY)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = require(crud.get_product(db, product_id), NOT_FOUND)
    crud.delete_product(db, product)
