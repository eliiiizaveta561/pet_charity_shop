from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas, services
from ..auth import get_current_user
from ..database import get_db
from ..errors import require

router = APIRouter(tags=["Отзывы"])

NOT_FOUND = "Отзыв не найден"
PRODUCT_NOT_FOUND = "Товар не найден"


@router.get("/products/{product_id}/reviews", response_model=list[schemas.ReviewRead])
def list_reviews(product_id: int, db: Session = Depends(get_db)):
    require(crud.get_product(db, product_id), PRODUCT_NOT_FOUND)
    return crud.get_reviews(db, product_id)


@router.post(
    "/products/{product_id}/reviews",
    response_model=schemas.ReviewRead,
    status_code=status.HTTP_201_CREATED,
)
def create_review(
    product_id: int,
    data: schemas.ReviewCreate,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require(crud.get_product(db, product_id), PRODUCT_NOT_FOUND)
    return crud.create_review(db, product_id, user.id, data)


@router.patch("/reviews/{review_id}", response_model=schemas.ReviewRead)
def update_review(
    review_id: int,
    data: schemas.ReviewUpdate,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    review = require(crud.get_review(db, review_id), NOT_FOUND)
    services.check_review_author(review, user)
    return crud.update_review(db, review, data)


@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    review = require(crud.get_review(db, review_id), NOT_FOUND)
    services.check_review_delete(review, user)
    crud.delete_review(db, review)
