from fastapi import APIRouter, Depends, HTTPException, status
from app.services.observability.observability_service import ObservabilityService
from app.core.dependencies import get_tenant_id
from typing import Optional, Dict, Any
from datetime import datetime

router = APIRouter()


@router.post("/traces")
async def ingest_trace(
    trace_data: Dict[str, Any],
    tenant_id: str = Depends(get_tenant_id),
    observability_service: ObservabilityService = Depends()
):
    """
    Ingest trace data from AI backend
    """
    try:
        # Add tenant ID to trace data
        trace_data["tenant_id"] = tenant_id
        trace_data["timestamp"] = datetime.utcnow().isoformat() + "Z"
        
        # Save trace (implementation would depend on your observability service)
        trace_id = await observability_service.save_trace(trace_data)
        
        return {
            "trace_id": trace_id,
            "status": "ingested",
            "timestamp": trace_data["timestamp"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/traces/{trace_id}")
async def get_trace(
    trace_id: str,
    tenant_id: str = Depends(get_tenant_id),
    observability_service: ObservabilityService = Depends()
):
    """
    Get trace by ID
    """
    trace = await observability_service.get_trace(trace_id, tenant_id)
    if not trace:
        raise HTTPException(status_code=404, detail="Trace not found")
    
    return trace


@router.get("/metrics")
async def get_metrics(
    tenant_id: str = Depends(get_tenant_id),
    metric_name: Optional[str] = None,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    interval: str = "1h",
    observability_service: ObservabilityService = Depends()
):
    """
    Get aggregated metrics
    """
    # Parse time parameters if provided
    start_dt = datetime.fromisoformat(start_time.replace("Z", "+00:00")) if start_time else None
    end_dt = datetime.fromisoformat(end_time.replace("Z", "+00:00")) if end_time else None
    
    metrics = await observability_service.get_metrics(
        tenant_id=tenant_id,
        metric_name=metric_name,
        start_time=start_dt,
        end_time=end_dt,
        interval=interval
    )
    
    return {
        "tenant_id": tenant_id,
        "metrics": metrics,
        "time_range": {
            "start": start_time,
            "end": end_time
        },
        "interval": interval
    }