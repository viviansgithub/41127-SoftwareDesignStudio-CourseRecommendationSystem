from unittest.mock import Mock

import pytest
from config import Settings
from db_handler.db_handler import DBHandler
from db_handler.password import PasswordHandler
from fastapi.testclient import TestClient


@pytest.fixture(autouse=True)
def mock_env_variables(monkeypatch):
    for key, value in Settings.__annotations__.items():
        monkeypatch.setenv(key, str(value()))


@pytest.fixture
def app(working_container):
    from app import create_app

    return create_app(working_container, Settings())


@pytest.fixture
def client(app):
    return TestClient(app)


@pytest.fixture
def mock_password_handler():
    return Mock(spec=PasswordHandler)


@pytest.fixture
def working_password_handler():
    return PasswordHandler("utf-8")


@pytest.fixture
def mock_db_handler():
    return Mock(spec=DBHandler)


@pytest.fixture
def working_db_handler(working_password_handler: PasswordHandler):
    return DBHandler(working_password_handler)


@pytest.fixture
def working_container(mock_db_handler: DBHandler):
    from app import create_container

    container = create_container(Settings())
    container.db_handler.override(mock_db_handler)
    return container
