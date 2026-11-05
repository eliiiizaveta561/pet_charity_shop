from typing import Optional

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db
from ..errors import require

router = APIRouter(prefix="/charities", tags=["Благотворительные организации"])

NOT_FOUND = "Организация не найдена"


@router.get("", response_model=list[schemas.CharityRead])
def list_charities(city: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_charities(db, city)


@router.get("/{charity_id}", response_model=schemas.CharityRead)
def read_charity(charity_id: int, db: Session = Depends(get_db)):
    return require(crud.get_charity(db, charity_id), NOT_FOUND)


@router.get("/{charity_id}/donations", response_model=schemas.DonationSummary)
def read_donation_summary(charity_id: int, db: Session = Depends(get_db)):
    require(crud.get_charity(db, charity_id), NOT_FOUND)
    return crud.get_donation_summary(db, charity_id)


@router.post("", response_model=schemas.CharityRead, status_code=status.HTTP_201_CREATED)
def create_charity(data: schemas.CharityCreate, db: Session = Depends(get_db)):
    return crud.create_charity(db, data)


@router.patch("/{charity_id}", response_model=schemas.CharityRead)
def update_charity(charity_id: int, data: schemas.CharityUpdate, db: Session = Depends(get_db)):
    charity = require(crud.get_charity(db, charity_id), NOT_FOUND)
    return crud.update_charity(db, charity, data)


@router.delete("/{charity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_charity(charity_id: int, db: Session = Depends(get_db)):
    charity = require(crud.get_charity(db, charity_id), NOT_FOUND)
    crud.delete_charity(db, charity)
