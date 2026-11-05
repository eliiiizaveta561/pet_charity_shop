from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db
from ..errors import require

router = APIRouter(prefix="/categories", tags=["Категории"])

NOT_FOUND = "Категория не найдена"


@router.get("", response_model=list[schemas.CategoryRead])
def list_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)


@router.get("/{category_id}", response_model=schemas.CategoryRead)
def read_category(category_id: int, db: Session = Depends(get_db)):
    return require(crud.get_category(db, category_id), NOT_FOUND)


@router.post("", response_model=schemas.CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(data: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db, data)


@router.patch("/{category_id}", response_model=schemas.CategoryRead)
def update_category(category_id: int, data: schemas.CategoryUpdate, db: Session = Depends(get_db)):
    category = require(crud.get_category(db, category_id), NOT_FOUND)
    return crud.update_category(db, category, data)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = require(crud.get_category(db, category_id), NOT_FOUND)
    crud.delete_category(db, category)
