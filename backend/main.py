from contextlib import asynccontextmanager
from typing import List

from fastapi import APIRouter, Depends, FastAPI, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from db import CatFact, get_session, init_db, insert_fact
from datetime import date 

class CatFactOut(BaseModel):
    id: int
    fact: str
    created_at: date 

    class Config:
        orm_mode = True


# Lifespan handler to initialize DB
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

# FastAPI app setup
app = FastAPI(title="Cat Facts API", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Router
router = APIRouter(prefix="/catfacts", tags=["Cat Facts"])

@router.get("/", response_model=List[CatFactOut])
def list_cat_facts(db: Session = Depends(get_session)):
    return db.query(CatFact).order_by(CatFact.id).all()

@router.get("/random", response_model=dict)
def random_cat_fact(db: Session = Depends(get_session)):
    fact = db.query(CatFact).order_by(func.random()).first()
    if not fact:
        raise HTTPException(status_code=404, detail="No cat facts available.")
    return {"fact": fact.fact}

@router.post("/", status_code=201)
def create_cat_fact(
    fact: str = Form(..., description="Cat fact (5-500 chars)"),
    db: Session = Depends(get_session),
):
    try:
        new_id = insert_fact(db, fact)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    if new_id is None:
        raise HTTPException(status_code=409, detail="Duplicate fact – already exists.")
    return {"message": "Fact inserted", "id": new_id}

# Redirect root to /catfacts
app.include_router(router)

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/catfacts")
