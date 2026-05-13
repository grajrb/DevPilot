from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from app.services.evaluation.evaluation_service import EvaluationService
from app.core.dependencies import get_tenant_id, get_user_id
from typing import Optional, List, Dict, Any
from app.models.schemas import EvaluationCreate, EvaluationResponse, EvaluationRunResponse, EvaluationResultResponse

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED, response_model=EvaluationResponse)
async def create_evaluation(
    evaluation: EvaluationCreate,
    tenant_id: str = Depends(get_tenant_id),
    user_id: str = Depends(get_user_id),
    evaluation_service: EvaluationService = Depends()
):
    """
    Create a new evaluation
    """
    try:
        eval_obj = await evaluation_service.create_evaluation(
            tenant_id=tenant_id,
            created_by_user_id=user_id,
            name=evaluation.name,
            description=evaluation.description,
            evaluation_type=evaluation.type,
            dataset_id=evaluation.dataset_id,
            metrics=evaluation.metrics,
            config=evaluation.config
        )
        return eval_obj
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=List[EvaluationResponse])
async def list_evaluations(
    tenant_id: str = Depends(get_tenant_id),
    evaluation_service: EvaluationService = Depends(),
    limit: int = 100,
    offset: int = 0
):
    """
    List evaluations for a tenant
    """
    evaluations = await evaluation_service.list_evaluations(
        tenant_id=tenant_id,
        limit=limit,
        offset=offset
    )
    return evaluations


@router.get("/{evaluation_id}", response_model=EvaluationResponse)
async def get_evaluation(
    evaluation_id: str,
    tenant_id: str = Depends(get_tenant_id),
    evaluation_service: EvaluationService = Depends()
):
    """
    Get evaluation by ID
    """
    evaluation = await evaluation_service.get_evaluation(evaluation_id, tenant_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    
    return evaluation


@router.post("/{evaluation_id}/run", status_code=status.HTTP_202_ACCEPTED, response_model=EvaluationRunResponse)
async def run_evaluation(
    evaluation_id: str,
    background_tasks: BackgroundTasks,
    tenant_id: str = Depends(get_tenant_id),
    user_id: str = Depends(get_user_id),
    evaluation_service: EvaluationService = Depends()
):
    """
    Run an evaluation (asynchronous)
    """
    try:
        # Verify evaluation exists and belongs to tenant
        evaluation = await evaluation_service.get_evaluation(evaluation_id, tenant_id)
        if not evaluation:
            raise HTTPException(status_code=404, detail="Evaluation not found")
        
        # Start evaluation run
        run = await evaluation_service.start_evaluation_run(
            evaluation_id=evaluation_id,
            tenant_id=tenant_id,
            started_by_user_id=user_id
        )
        
        # Add background task to actually run the evaluation
        background_tasks.add_task(
            evaluation_service.run_evaluation,
            run_id=str(run.id),
            tenant_id=tenant_id
        )
        
        return run
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/runs/{run_id}/results", response_model=List[EvaluationResultResponse])
async def get_evaluation_results(
    run_id: str,
    tenant_id: str = Depends(get_tenant_id),
    evaluation_service: EvaluationService = Depends()
):
    """
    Get results for an evaluation run
    """
    results = await evaluation_service.get_evaluation_results(
        run_id=run_id,
        tenant_id=tenant_id
    )
    return results


@router.get("/datasets", response_model=List[Dict[str, Any]])
async def list_datasets(
    tenant_id: str = Depends(get_tenant_id),
    evaluation_service: EvaluationService = Depends(),
    limit: int = 100,
    offset: int = 0
):
    """
    List datasets for a tenant
    """
    datasets = await evaluation_service.list_datasets(
        tenant_id=tenant_id,
        limit=limit,
        offset=offset
    )
    return datasets


@router.post("/datasets", status_code=status.HTTP_201_CREATED)
async def create_dataset(
    dataset: Dict[str, Any],
    tenant_id: str = Depends(get_tenant_id),
    user_id: str = Depends(get_user_id),
    evaluation_service: EvaluationService = Depends()
):
    """
    Create a new dataset
    """
    try:
        dataset_obj = await evaluation_service.create_dataset(
            tenant_id=tenant_id,
            name=dataset["name"],
            dataset_type=dataset["type"],
            storage_location=dataset.get("storage_location"),
            metadata=dataset.get("metadata", {}),
            row_count=dataset.get("row_count", 0)
        )
        return dataset_obj
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))