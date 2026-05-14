from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth import router as auth_router
from app.routers.videos import router as videos_router
from app.routers.comments import router as comments_router
from app.routers.categories import router as categories_router
from app.routers.user import router as user_router

from app.db.session import engine
from sqlmodel import SQLModel

app = FastAPI(
    title="Video Platform"
)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# =========================
# CORS
# =========================
origins = [
    "http://localhost:5173",   # Vite
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROUTERS
# =========================
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(videos_router, prefix="/api/videos", tags=["Videos"])
app.include_router(comments_router, prefix="/api/comments", tags=["Comments"])
app.include_router(categories_router, prefix="/api/categories", tags=["Categories"])
app.include_router(user_router, prefix="/api/users", tags=["Users"])

@app.get("/health")
def health():
    return {"status": "ok"}
