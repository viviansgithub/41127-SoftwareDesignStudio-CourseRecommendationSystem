from db_handler.db_handler import DBHandler
from db_handler.password import PasswordHandler
from dependency_injector import providers
from dependency_injector.containers import DeclarativeContainer


class Container(DeclarativeContainer):
    config = providers.Configuration()

    password_handler = providers.Factory(PasswordHandler, config.encoding)
    db_handler = providers.Singleton(
        DBHandler,
        password_handler=password_handler,
    )
