import sys

from . import models
from .database import Base, engine


def main() -> None:
    # create_all не меняет уже существующие таблицы. Если в модели появились новые
    # столбцы (например, orders.user_id), таблицы нужно пересоздать: python -m app.init_db --reset
    if "--reset" in sys.argv:
        Base.metadata.drop_all(bind=engine)
        print("Старые таблицы удалены")
    Base.metadata.create_all(bind=engine)
    print("Таблицы в базе:", ", ".join(models.Base.metadata.tables))


if __name__ == "__main__":
    main()
