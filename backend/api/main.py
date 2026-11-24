from fastapi import FastAPI
from contextlib import asynccontextmanager
from .routers import RpiController, Auth, Activities, Scores
from . import models
from .database import engine
from .utilities import initial_servo_angle_setup, initial_super_admin_setup
from .rpi_gpio_module import setup_shutdown_detection, gpio_cleanup
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_shutdown_detection()
    yield
    gpio_cleanup()

initial_servo_angle_setup()
initial_super_admin_setup()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5123', 'file://'],
    allow_methods=['*'],
    allow_headers=['*'],
    allow_credentials=True,
)

@app.get('/')
def health_check():
    return { 'message': 'Health Check Complete' }

app.include_router(RpiController.router)
app.include_router(Auth.router)
app.include_router(Activities.router)
app.include_router(Scores.router)