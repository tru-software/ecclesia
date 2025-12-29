from fastapi import FastAPI
from app.api.health import router as health_router
from app.api.hello import router as hello_router

app = FastAPI(title="Ecclesia API")
app.include_router(health_router)
app.include_router(hello_router)


@app.get("/")
def root():
    return {"status": "ok"}
