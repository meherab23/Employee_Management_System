from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DB_URL = "mongodb://localhost:27017/fastapi_db"

client = AsyncIOMotorClient(MONGO_DB_URL)
database = client.fastapi_db

async def connect_db():
    pass 

async def disconnect_db():
    pass  
