import logging
import traceback
from functools import wraps
from typing import Callable, ParamSpec, TypeVar

from main_utils import Error

log = logging.getLogger(__name__)

P = ParamSpec("P")
T = TypeVar("T")


def safe(method: Callable[P, T]):
    @wraps(method)
    def decorator(*args: P.args, **kwargs: P.kwargs) -> T:
        try:
            return method(*args, **kwargs)
        except Exception as e:
            message = f"unexpected error occurred: {e}"
            log.error(message)
            log.error(traceback.format_exc())
            return Error(code=500, message=message)

    return decorator
