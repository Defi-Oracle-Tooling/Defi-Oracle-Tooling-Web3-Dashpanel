from web3 import Web3
from app.config import settings

# Initialize a Web3 instance to interact with the Besu node.
web3 = Web3(Web3.HTTPProvider(settings.BESU_RPC_URL))

def process_withdrawal(withdrawal_address: str, amount: float) -> str:
    # Create an on-chain withdrawal transaction.
    if not web3.is_address(withdrawal_address):
        raise ValueError("Invalid withdrawal address provided.")
    if amount <= 0:
        raise ValueError("Withdrawal amount must be positive.")

    try:
        nonce = web3.eth.get_transaction_count(
            settings.MASTER_EXCHANGE_ADDRESS
        )
        tx = {
            'from': settings.MASTER_EXCHANGE_ADDRESS,
            'to': withdrawal_address,
            'value': web3.to_wei(amount, 'ether'),
            'nonce': nonce,
            'gas': 21000,  # Standard gas limit for ETH transfer
            'gasPrice': web3.eth.gas_price,
            'chainId': settings.CHAIN_ID,
        }
        signed_tx = web3.eth.account.sign_transaction(
            tx, settings.MASTER_PRIVATE_KEY
        )
        tx_hash = web3.eth.send_raw_transaction(
            signed_tx.rawTransaction
        )
        return web3.to_hex(tx_hash)
    except Exception as e:
        # Log the error details for debugging
        print(f"Error processing withdrawal: {e}")
        raise Exception("Failed to process withdrawal.") from e
