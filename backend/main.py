from fastapi import FastAPI
from api.users import router
from api.vidyaplannerapi import router as vidyaplanner_router
app = FastAPI()

app.include_router(router, prefix="/api", tags=["Users"])
app.include_router(vidyaplanner_router, prefix="/api", tags=["Vidyaplanner"])