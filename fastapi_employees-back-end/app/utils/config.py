from dotenv import load_dotenv
import os


load_dotenv()


MONGO_DB_URL = os.getenv("MONGO_DB_URL")


print(f"MONGO_DB_URL: {MONGO_DB_URL}")


if not MONGO_DB_URL:
    raise ValueError("MONGO_DB_URL is not set in the environment variables.")
