import logging
from functools import wraps
from typing import Callable, ParamSpec, TypeVar

from fastapi import HTTPException
from main_utils import Error, Ok

log = logging.getLogger(__name__)

P = ParamSpec("P")
T = TypeVar("T")


def parse(method: Callable[P, T]):
    @wraps(method)
    def decorator(*args: P.args, **kwargs: P.kwargs) -> T:
        response: Ok | Error = method(*args, **kwargs)
        if not response.is_ok():
            raise HTTPException(
                status_code=response.code,
                detail=response.message,
            )
        return response.payload

    return decorator
