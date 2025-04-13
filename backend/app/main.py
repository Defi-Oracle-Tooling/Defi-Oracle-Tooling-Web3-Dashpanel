from fastapi import FastAPI
from app.routers import virtual_accounts, webhooks, sockets

app = FastAPI(title="Tatum.io & Besu Integration Backend")

# Register routers for REST API, webhooks, and WebSocket endpoints
app.include_router(
    virtual_accounts.router,
    prefix="/api/va",
    tags=["Virtual Accounts"]
)
app.include_router(
    webhooks.router, prefix="/webhooks", tags=["Webhooks"]
)
app.include_router(
    sockets.router, prefix="/ws", tags=["WebSocket"]
)

@app.get("/")
async def root():
    return {"message": "Backend service is running."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app", host="0.0.0.0", port=8000, reload=True
    )
