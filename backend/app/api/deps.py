from app.db.session import SessionLocal


async def get_db():
    with SessionLocal() as session:
        yield session
