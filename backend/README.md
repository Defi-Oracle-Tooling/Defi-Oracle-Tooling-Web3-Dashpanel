# Tatum.io & Besu Integration Backend

This backend service interacts with Tatum.io APIs and a Hyperledger Besu
blockchain network (or other EVM chains). It provides:

 - REST API endpoints for virtual account operations.
 - Webhook endpoints for asynchronous event processing.
 - WebSocket endpoints for real-time, bidirectional communication.

## Getting Started

1.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

2.  **Configure environment variables:**
    Create a `.env` file in the `backend/` root with:
    ```dotenv
    TATUM_API_KEY=your_tatum_api_key
    TATUM_API_URL=https://api.tatum.io/v3
    BESU_RPC_URL=https://your-besu-node.example.com
    CHAIN_ID=138 # Example chain ID
    MASTER_EXCHANGE_ADDRESS=0xYourMasterExchangeAddress
    MASTER_PRIVATE_KEY=your_master_private_key
    ```
    Replace placeholders with your actual credentials and URLs.

3.  **Run the server:**
    ```bash
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    ```
    The server will be accessible at `http://localhost:8000`.

## Integration with Frontend

This backend provides API, Webhook, and WebSocket endpoints for your
TypeScript-React frontend. It integrates Tatum.io services and
supports connectivity to multiple EVM blockchains via configuration.
