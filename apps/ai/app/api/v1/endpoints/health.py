from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-backend"}

@router.get("/ready")
async def readiness_check():
    # TODO: Add DB, Redis connectivity checks
    return {"status": "ready", "service": "ai-backend"}
