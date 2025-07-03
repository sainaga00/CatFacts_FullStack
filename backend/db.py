import os
from contextlib import contextmanager
from datetime import date
from typing import Generator, Optional
from sqlalchemy import text

from sqlalchemy import Column, Date, Integer, String, create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, declarative_base, sessionmaker

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cat_facts.db")
IS_SQLITE = DATABASE_URL.startswith("sqlite")

ENGINE = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if IS_SQLITE else {},
    pool_pre_ping=True,
    future=True,
)
SessionLocal = sessionmaker(bind=ENGINE, autocommit=False, autoflush=False, future=True)
Base = declarative_base()

# ORM Model
class CatFact(Base):
    __tablename__ = "cat_facts"
    id = Column(Integer, primary_key=True, index=True)
    fact = Column(String, unique=True, nullable=False)
    created_at = Column(Date, default=date.today, nullable=False)

# Create tables
def init_db() -> None:
    # Create tables if they don't exist
    Base.metadata.create_all(bind=ENGINE)

    # Enable Write-Ahead Logging to avoid "database is locked" issues
    with ENGINE.connect() as conn:
        conn.execute(text("PRAGMA journal_mode=WAL;"))

# FastAPI-compatible session dependency
def get_session() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Context manager for external scripts
@contextmanager
def session_scope() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

# Utility function to insert a new cat fact
def insert_fact(db: Session, fact_text: str) -> Optional[int]:
    fact_clean = fact_text.strip()
    if not (5 <= len(fact_clean) <= 500):
        raise ValueError("Fact length must be between 5 and 500 characters.")
    new_fact = CatFact(fact=fact_clean)
    try:
        db.add(new_fact)
        db.commit()
        db.refresh(new_fact)
        return new_fact.id
    except IntegrityError:
        db.rollback()
        return None
