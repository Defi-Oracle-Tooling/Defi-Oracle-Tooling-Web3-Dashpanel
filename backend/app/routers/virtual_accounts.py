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
        raise HTTPException(
            status_code=500, detail=f"Error fetching balance: {e}"
        )
