from . import models
from .database import Base, engine


def main() -> None:
    Base.metadata.create_all(bind=engine)
    print("Созданы таблицы:", ", ".join(models.Base.metadata.tables))


if __name__ == "__main__":
    main()
