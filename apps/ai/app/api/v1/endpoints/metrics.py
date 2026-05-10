from fastapi import APIRouter, Depends
from app.services.observability.metrics_collector import MetricsCollector
from app.core.dependencies import get_tenant_id

router = APIRouter()

@router.post("/ingest")
async def ingest_metrics(
    data: dict,
    metrics_collector: MetricsCollector = Depends(),
    tenant_id: str = Depends(get_tenant_id),
):
    """
    Ingest metrics from AI backend (token counts, latency, cost)
    """
    await metrics_collector.record(
        tenant_id=tenant_id,
        metric_type=data.get("type"),
        value=data.get("value"),
        tags=data.get("tags", {}),
    )
    return {"status": "recorded"}
