from pydantic import BaseModel

class VAResponse(BaseModel):
    id: str
    balance: float
    currency: str
    # Add more fields from the Tatum.io response as needed.
