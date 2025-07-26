from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.users import router
from api.vidyaplannerapi import router as vidyaplanner_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api", tags=["Users"])
app.include_router(vidyaplanner_router, prefix="/api", tags=["Vidyaplanner"])