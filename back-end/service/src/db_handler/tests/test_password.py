import pytest
from db_handler.password import PasswordHandler
from hypothesis import HealthCheck, given, settings
from hypothesis import strategies as st


@pytest.mark.parametrize(
    argnames=["password", "expected"],
    argvalues=[
        ["a", "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb"]
    ],
)
def test_hash_password(
    password: str,
    expected: str,
    working_password_handler: PasswordHandler,
):
    hashed_password = working_password_handler.hash_password(password)
    assert len(hashed_password) == 64
    assert hashed_password == expected


@given(password=st.text())
@settings(suppress_health_check=[HealthCheck.function_scoped_fixture])
def test_hash_password_invariant(
    password: str,
    working_password_handler: PasswordHandler,
):
    hashed_password = working_password_handler.hash_password(password)
    assert len(hashed_password) == 64
