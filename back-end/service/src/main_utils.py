import logging
from typing import Any, ParamSpec, TypeVar

log = logging.getLogger(__name__)

P = ParamSpec("P")
T = TypeVar("T")


class ResultMeta(type):
    def __getitem__(self, key):
        """for type declaration"""
        ...


class Result:
    __is_ok__ = None

    def is_ok(self):
        return self.__is_ok__

    def is_error(self):
        return not self.__is_ok__


class Ok(Result, metaclass=ResultMeta):
    __is_ok__ = True

    def __init__(self, payload: Any = None) -> None:
        self.payload = payload


class Error(Result):
    __is_ok__ = False

    def __init__(
        self,
        code: int = None,
        message: str = None,
    ) -> None:
        self.code = code
        self.message = message
