#!/usr/bin/env python3
"""
generate_backend.py

This script generates a complete backend project scaffolding for a FastAPI backend
that integrates Tatum.io services and blockchain connectivity (e.g., Hyperledger Besu).
It is designed to serve as the backend replacement for the TypeScript-React frontend
in your mono-repository.

The generated project will reside in a "backend" directory at the project root with
the following structure:

backend/
├── app/
│   ├── __init__.py
│   ├── main.py             # FastAPI application entry point.
│   ├── config.py           # Configuration loader using python-dotenv.
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── virtual_accounts.py  # REST API endpoints for virtual account operations.
│   │   ├── webhooks.py          # Webhook endpoints for receiving Tatum or blockchain events.
│   │   └── sockets.py           # WebSocket endpoints for bidirectional communication.
│   ├── services/
│   │   ├── __init__.py
│   │   ├── tatum_service.py     # Service functions to call Tatum.io APIs.
│   │   └── besu_service.py      # Service functions for blockchain integration (web3.py).
│   └── models/
│       ├── __init__.py
│       └── schemas.py           # Pydantic schemas for data validation.
├── requirements.txt       # List of required packages.
└── README.md              # Documentation and instructions.
"""

import os
import textwrap
from pathlib import Path

# Determine the script directory and the project root.
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
BACKEND_DIR = PROJECT_ROOT / "backend"

def write_file(file_path: Path, content: str) -> None:
    """Write content to file and print confirmation."""
    with open(file_path, "w") as f:
        f.write(content)
    print(f"Created {file_path}")

def create_dir(dir_path: Path) -> None:
    """Create directory if it doesn't exist, print confirmation."""
    os.makedirs(dir_path, exist_ok=True)
    print(f"Created directory {dir_path}")

def generate_structure() -> None:
    """Generate the backend directory structure and file contents."""
    # Folder structure list.
    folders = [
        BACKEND_DIR / "app",
        BACKEND_DIR / "app" / "routers",
        BACKEND_DIR / "app" / "services",
        BACKEND_DIR / "app" / "models",
    ]
    for folder in folders:
        create_dir(folder)

    # Create __init__.py files to mark modules.
    init_files = [
        BACKEND_DIR / "app" / "__init__.py",
        BACKEND_DIR / "app" / "routers" / "__init__.py",
        BACKEND_DIR / "app" / "services" / "__init__.py",
        BACKEND_DIR / "app" / "models" / "__init__.py",
    ]
    for init_file in init_files:
        write_file(init_file, "# This file marks the directory as a Python module.\n")

    # Create the FastAPI entry point: main.py
    main_py = textwrap.dedent("""\
        from fastapi import FastAPI
        from app.routers import virtual_accounts, webhooks, sockets

        app = FastAPI(title="Tatum.io & Besu Integration Backend")

        # Register routers for REST API endpoints, webhooks, and WebSocket endpoints
        app.include_router(virtual_accounts.router, prefix="/api/va", tags=["Virtual Accounts"])
        app.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])
        app.include_router(sockets.router, prefix="/ws", tags=["WebSocket"])

        @app.get("/")
        async def root():
            return {"message": "Backend service is running."}

        if __name__ == "__main__":
            import uvicorn
            uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
    """)
    write_file(BACKEND_DIR / "app" / "main.py", main_py)

    # Create a config.py file to load environment variables using python-dotenv.
    config_py = textwrap.dedent("""\
        import os
        from dotenv import load_dotenv

        load_dotenv()  # Load environment variables from a .env file if available

        class Settings:
            # Tatum configuration
            TATUM_API_KEY = os.getenv("TATUM_API_KEY", "YOUR_TATUM_API_KEY")
            TATUM_API_URL = os.getenv("TATUM_API_URL", "https://api.tatum.io/v3")
            # Blockchain configuration
            BESU_RPC_URL = os.getenv("BESU_RPC_URL", "https://your-besu-node.example.com")
            CHAIN_ID = int(os.getenv("CHAIN_ID", "138"))
            MASTER_EXCHANGE_ADDRESS = os.getenv("MASTER_EXCHANGE_ADDRESS", "0xYourMasterExchangeAddress")
            MASTER_PRIVATE_KEY = os.getenv("MASTER_PRIVATE_KEY", "YOUR_PRIVATE_KEY")

        settings = Settings()
    """)
    write_file(BACKEND_DIR / "app" / "config.py", config_py)

    # Create REST API endpoints for virtual accounts in routers/virtual_accounts.py.
    virtual_accounts_router = textwrap.dedent("""\
        from fastapi import APIRouter, HTTPException
        from app.models.schemas import VAResponse
        from app.services.tatum_service import get_virtual_account_data

        router = APIRouter()

        @router.get("/balance/{user_id}", response_model=VAResponse)
        async def get_balance(user_id: str):
            try:
                data = get_virtual_account_data(user_id)
                return data
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
    """)
    write_file(BACKEND_DIR / "app" / "routers" / "virtual_accounts.py", virtual_accounts_router)

    # Create webhook endpoints in routers/webhooks.py.
    webhooks_router = textwrap.dedent("""\
        from fastapi import APIRouter, Request

        router = APIRouter()

        @router.post("/tatum")
        async def tatum_webhook(request: Request):
            payload = await request.json()
            # TODO: Process webhook payload from Tatum.io or blockchain events.
            return {"status": "received", "data": payload}
    """)
    write_file(BACKEND_DIR / "app" / "routers" / "webhooks.py", webhooks_router)

    # Create WebSocket endpoints in routers/sockets.py.
    sockets_router = textwrap.dedent("""\
        from fastapi import APIRouter, WebSocket, WebSocketDisconnect

        router = APIRouter()

        class ConnectionManager:
            def __init__(self):
                self.active_connections = []

            async def connect(self, websocket: WebSocket):
                await websocket.accept()
                self.active_connections.append(websocket)

            def disconnect(self, websocket: WebSocket):
                self.active_connections.remove(websocket)

            async def broadcast(self, message: str):
                for connection in self.active_connections:
                    await connection.send_text(message)

        manager = ConnectionManager()

        @router.websocket("/live")
        async def websocket_endpoint(websocket: WebSocket):
            await manager.connect(websocket)
            try:
                while True:
                    data = await websocket.receive_text()
                    # For demonstration: echo back the message.
                    await manager.broadcast(f"Echo: {data}")
            except WebSocketDisconnect:
                manager.disconnect(websocket)
    """)
    write_file(BACKEND_DIR / "app" / "routers" / "sockets.py", sockets_router)

    # Create Tatum service functions in services/tatum_service.py.
    tatum_service = textwrap.dedent("""\
        import requests
        from app.config import settings

        def get_virtual_account_data(user_id: str):
            # Request virtual account details from Tatum.io.
            url = f"{settings.TATUM_API_URL}/ledger/account/{user_id}"
            headers = {"x-api-key": settings.TATUM_API_KEY}
            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                raise Exception(f"Tatum API error: {response.text}")
            return response.json()

        # Additional functions for crediting or debiting the virtual account can be added.
    """)
    write_file(BACKEND_DIR / "app" / "services" / "tatum_service.py", tatum_service)

    # Create Blockchain service functions in services/besu_service.py.
    besu_service = textwrap.dedent("""\
        from web3 import Web3
        from app.config import settings

        # Initialize a Web3 instance to interact with the Besu node.
        web3 = Web3(Web3.HTTPProvider(settings.BESU_RPC_URL))

        def process_withdrawal(withdrawal_address: str, amount: float) -> str:
            # Create an on-chain withdrawal transaction.
            tx = {
                'from': settings.MASTER_EXCHANGE_ADDRESS,
                'to': withdrawal_address,
                'value': web3.toWei(amount, 'ether'),
                'chainId': settings.CHAIN_ID,
                # Optionally specify gasPrice and gas limit here.
            }
            signed_tx = web3.eth.account.sign_transaction(tx, settings.MASTER_PRIVATE_KEY)
            tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
            return web3.toHex(tx_hash)
    """)
    write_file(BACKEND_DIR / "app" / "services" / "besu_service.py", besu_service)

    # Create Pydantic models/schemas in models/schemas.py.
    schemas = textwrap.dedent("""\
        from pydantic import BaseModel

        class VAResponse(BaseModel):
            id: str
            balance: float
            currency: str
            # Add more fields from the Tatum.io response as needed.
    """)
    write_file(BACKEND_DIR / "app" / "models" / "schemas.py", schemas)

    # Create requirements.txt with necessary packages.
    requirements = textwrap.dedent("""\
        fastapi
        uvicorn
        requests
        python-dotenv
        web3
        pydantic
    """)
    write_file(BACKEND_DIR / "requirements.txt", requirements)

    # Create README.md with basic information and setup instructions.
    readme = textwrap.dedent("""\
        # Tatum.io & Besu Integration Backend

        This backend service is auto-generated to interact with Tatum.io APIs and a Hyperledger Besu
        blockchain network (or other Elemental Imperium EVM chains). It provides the following:

         - REST API endpoints for virtual account operations.
         - Webhook endpoints for asynchronous event processing.
         - WebSocket endpoints for real-time, bidirectional communication.

        ## Getting Started

        1. Install dependencies:
           ```
           pip install -r requirements.txt
           ```

        2. Configure environment variables:
           Create a `.env` file in the backend root (where `config.py` is located) with:
           ```
           TATUM_API_KEY=your_tatum_api_key
           TATUM_API_URL=https://api.tatum.io/v3
           BESU_RPC_URL=https://your-besu-node.example.com
           CHAIN_ID=138
           MASTER_EXCHANGE_ADDRESS=0xYourMasterExchangeAddress
           MASTER_PRIVATE_KEY=your_master_private_key
           ```

        3. Run the server:
           ```
           uvicorn app.main:app --reload
           ```

        ## Integration with Frontend

        This backend provides API, Webhook, and WebSocket endpoints that your TypeScript-React frontend
        can communicate with. It also integrates Tatum.io services, including beta endpoints, and supports
        connectivity to multiple Elemental Imperium EVM blockchains via parameterized configuration.
    """)
    write_file(BACKEND_DIR / "README.md", readme)

def main() -> None:
    print(f"Generating backend project scaffolding in: {BACKEND_DIR}")
    generate_structure()
    print("Backend project scaffolding generated successfully.")

if __name__ == "__main__":
    main()      