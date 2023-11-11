from db_connect import eng
from db_model import Base


def create():
    print("creating an empty database...")
    Base.metadata.create_all(eng)


if __name__ == "__main__":
    create()
