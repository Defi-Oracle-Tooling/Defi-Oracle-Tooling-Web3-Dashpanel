import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from a .env file

class Settings:
    # Tatum configuration
    TATUM_API_KEY = os.getenv("TATUM_API_KEY", "YOUR_TATUM_API_KEY")
    TATUM_API_URL = os.getenv(
        "TATUM_API_URL", "https://api.tatum.io/v3"
    )
    # Blockchain configuration
    BESU_RPC_URL = os.getenv(
        "BESU_RPC_URL", "https://your-besu-node.example.com"
    )
    CHAIN_ID = int(os.getenv("CHAIN_ID", "138"))
    MASTER_EXCHANGE_ADDRESS = os.getenv(
        "MASTER_EXCHANGE_ADDRESS", "0xYourMasterExchangeAddress"
    )
    MASTER_PRIVATE_KEY = os.getenv(
        "MASTER_PRIVATE_KEY", "YOUR_PRIVATE_KEY"
    )

settings = Settings()
