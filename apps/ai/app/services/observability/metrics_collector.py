from typing import Optional, Dict, Any
import redis.asyncio as redis
from app.core.config import settings
import structlog

logger = structlog.get_logger()

class MetricsCollector:
    """Collects and forwards metrics to platform backend"""
    def __init__(self):
        self.redis_client = redis.from_url(settings.REDIS_URL)

    async def record(
        self,
        tenant_id: str,
        metric_type: str,
        value: float,
        tags: Dict[str, str] = None,
    ):
        """
        Record a metric point
        """
        key = f"metrics:{tenant_id}:{metric_type}"
        await self.redis_client.hincrby(key, "count", 1)
        await self.redis_client.hincrbyfloat(key, "sum", value)

        # Also push to time-series for graphing (using sorted set)
        from time import time
        ts_key = f"timeseries:{tenant_id}:{metric_type}"
        await self.redis_client.zadd(ts_key, {str(value): time()})

        logger.info(
            "metric_recorded",
            tenant_id=tenant_id,
            type=metric_type,
            value=value,
            tags=tags or {},
        )

    async def get_aggregated(
        self,
        tenant_id: str,
        metric_type: str,
        start_time: int,
        end_time: int,
    ):
        """
        Get aggregated metrics for a time range
        """
        key = f"metrics:{tenant_id}:{metric_type}"
        data = await self.redis_client.hgetall(key)
        return data
