from fastapi import APIRouter, Depends, HTTPException, status
from app.services.copilot.copilot_service import CopilotService
from app.core.dependencies import get_tenant_id, get_user_id
from typing import Optional, Dict, Any
import uuid
from datetime import datetime

router = APIRouter()


@router.post("/sessions", status_code=status.HTTP_201_CREATED)
async def create_session(
    title: Optional[str] = None,
    tenant_id: str = Depends(get_tenant_id),
    user_id: str = Depends(get_user_id),
    copilot_service: CopilotService = Depends()
):
    """
    Create a new copilot session
    """
    session = await copilot_service.create_session(
        user_id=user_id,
        tenant_id=tenant_id,
        title=title
    )
    return {
        "session_id": str(session.id),
        "user_id": session.userId,
        "tenant_id": session.tenantId,
        "title": session.title,
        "created_at": session.createdAt,
        "updated_at": session.updatedAt
    }


@router.get("/sessions")
async def list_sessions(
    tenant_id: str = Depends(get_tenant_id),
    user_id: str = Depends(get_user_id),
    copilot_service: CopilotService = Depends(),
    limit: int = 50,
    offset: int = 0
):
    """
    List copilot sessions for user
    """
    sessions = await copilot_service.get_sessions(
        user_id=user_id,
        tenant_id=tenant_id,
        limit=limit,
        offset=offset
    )
    return {
        "sessions": [
            {
                "session_id": str(session.id),
                "user_id": session.userId,
                "tenant_id": session.tenantId,
                "title": session.title,
                "created_at": session.createdAt,
                "updated_at": session.updatedAt,
                "message_count": len(session.messages) if session.messages else 0
            }
            for session in sessions
        ],
        "limit": limit,
        "offset": offset
    }


@router.get("/sessions/{session_id}")
async def get_session(
    session_id: str,
    tenant_id: str = Depends(get_tenant_id),
    user_id: str = Depends(get_user_id),
    copilot_service: CopilotService = Depends()
):
    """
    Get a specific copilot session with messages
    """
    session = await copilot_service.get_session(
        session_id=session_id,
        user_id=user_id
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Verify tenant ownership
    if session.tenantId != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {
        "session_id": str(session.id),
        "user_id": session.userId,
        "tenant_id": session.tenantId,
        "title": session.title,
        "created_at": session.createdAt,
        "updated_at": session.updatedAt,
        "messages": [
            {
                "message_id": str(msg.id),
                "role": msg.role,
                "content": msg.content,
                "token_count": msg.tokenCount,
                "created_at": msg.createdAt
            }
            for msg in session.messages
        ] if session.messages else []
    }


@router.post("/sessions/{session_id}/messages", status_code=status.HTTP_201_CREATED)
async def add_message(
    session_id: str,
    role: str,
    content: str,
    token_count: Optional[int] = None,
    tenant_id: str = Depends(get_tenant_id),
    user_id: str = Depends(get_user_id),
    copilot_service: CopilotService = Depends()
):
    """
    Add a message to a copilot session
    """
    # Verify session exists and belongs to user/tenant
    session = await copilot_service.get_session(
        session_id=session_id,
        user_id=user_id
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.tenantId != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    message = await copilot_service.addMessage(
        session_id=session_id,
        role=role,
        content=content,
        token_count=token_count
    )
    
    return {
        "message_id": str(message.id),
        "session_id": session_id,
        "role": message.role,
        "content": message.content,
        "token_count": message.tokenCount,
        "created_at": message.createdAt
    }


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: str,
    tenant_id: str = Depends(get_tenant_id),
    user_id: str = Depends(get_user_id),
    copilot_service: CopilotService = Depends()
):
    """
    Delete a copilot session
    """
    # Verify session exists and belongs to user/tenant
    session = await copilot_service.get_session(
        session_id=session_id,
        user_id=user_id
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.tenantId != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    await copilot_service.deleteSession(
        session_id=session_id,
        user_id=user_id
    )
    
    return None


@router.post("/sessions/{session_id}/tools/use")
async def use_tool(
    session_id: str,
    tool_name: str,
    tool_input: Dict[str, Any],
    tenant_id: str = Depends(get_tenant_id),
    user_id: str = Depends(get_user_id),
    copilot_service: CopilotService = Depends()
):
    """
    Use a tool in a copilot session
    """
    # Verify session exists and belongs to user/tenant
    session = await copilot_service.get_session(
        session_id=session_id,
        user_id=user_id
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.tenantId != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # This would integrate with the actual tool execution system
    # For now, return a placeholder response
    return {
        "tool_call_id": f"call_{uuid.uuid4()}",
        "tool_name": tool_name,
        "tool_input": tool_input,
        "tool_output": f"Tool {tool_name} executed successfully",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }