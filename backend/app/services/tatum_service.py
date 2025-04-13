import requests
from app.config import settings

def get_virtual_account_data(user_id: str):
    # Request virtual account details from Tatum.io.
    url = f"{settings.TATUM_API_URL}/ledger/account/{user_id}"
    headers = {"x-api-key": settings.TATUM_API_KEY}
    try:
        response = requests.get(
            url, headers=headers, timeout=10
        )
        # Raise HTTPError for bad responses
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        # Handle connection errors, timeouts, etc.
        raise Exception(f"Tatum API request failed: {e}")
    except Exception as e:
        # Handle other potential errors like JSON decoding
        raise Exception(f"An error occurred: {e}")

# Additional functions for crediting or debiting can be added.
