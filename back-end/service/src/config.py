from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    local: bool = False
    encoding: str
    api_port: int = Field(alias="api-port", default=5000)
