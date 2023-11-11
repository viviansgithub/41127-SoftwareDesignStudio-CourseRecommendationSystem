import logging
import os

import main_utils
import uvicorn
from config import Settings
from container import Container
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from orchestrator import orchestrator
from router.routes import router


def create_container(settings: Settings):
    container = Container()
    container.config.from_dict(settings.model_dump())

    return container


def create_app(container: Container, settings: Settings) -> FastAPI:
    log = logging.getLogger(__name__)
    log.info(settings)

    app = FastAPI(debug=settings.local)

    app.container = container
    container.wire(modules=[orchestrator, main_utils])
    app.include_router(router)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["GET", "POST", "PATCH", "DELETE"],
        allow_headers=["*"],
    )
    return app


load_dotenv("service/.env")
load_dotenv("service/local.env")
settings = Settings()
container = create_container(settings)
app = create_app(container, settings)

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=settings.api_port,
        reload=True,
    )
