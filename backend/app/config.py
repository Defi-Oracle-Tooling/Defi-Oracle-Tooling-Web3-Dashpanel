"""Configuration module for loading environment variables."""

import os
from dotenv import load_dotenv  # type: ignore

# Load environment variables from a .env file
load_dotenv()


class Settings:
    """Settings class to manage application configuration."""

    def __init__(self):
        self.database_url = os.getenv("DATABASE_URL", "sqlite:///default.db")
        self.secret_key = os.getenv("SECRET_KEY", "default_secret")
