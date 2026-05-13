from typing import List, Optional
from app.models.document import ChatSession, ChatMessage
from app.core.database import async_session_maker
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from datetime import datetime


class CopilotService:
    def __init__(self):
        pass

    async def create_session(
        self, 
        user_id: str, 
        tenant_id: str, 
        title: Optional[str] = None
    ) -> ChatSession:
        """Create a new chat session"""
        async with async_session_maker() as session:
            chat_session = ChatSession(
                user_id=user_id,
                tenant_id=tenant_id,
                title=title or f"Chat Session {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            )
            session.add(chat_session)
            await session.commit()
            await session.refresh(chat_session)
            return chat_session

    async def get_sessions(
        self, 
        user_id: str, 
        tenant_id: str,
        limit: int = 50,
        offset: int = 0
    ) -> List[ChatSession]:
        """Get chat sessions for a user"""
        async with async_session_maker() as session:
            stmt = select(ChatSession).where(
                ChatSession.user_id == user_id,
                ChatSession.tenant_id == tenant_id
            ).order_by(ChatSession.updated_at.desc()).limit(limit).offset(offset)
            
            result = await session.execute(stmt)
            return result.scalars().all()

    async def get_session(
        self, 
        session_id: str, 
        user_id: str
    ) -> Optional[ChatSession]:
        """Get a specific chat session with messages"""
        async with async_session_maker() as session:
            stmt = select(ChatSession).where(
                ChatSession.id == session_id,
                ChatSession.user_id == user_id
            ).options(
                # In SQLAlchemy 2.0, you'd use selectinload for relationships
                # For now, we'll fetch messages separately
            )
            result = await session.execute(stmt)
            chat_session = result.scalar_one_or_none()
            
            if chat_session:
                # Fetch messages for this session
                msg_stmt = select(ChatMessage).where(
                    ChatMessage.session_id == session_id
                ).order_by(ChatMessage.created_at.asc())
                
                msg_result = await session.execute(msg_stmt)
                chat_session.messages = msg_result.scalars().all()
            
            return chat_session

    async def addMessage(
        self, 
        session_id: str, 
        role: str, 
        content: str, 
        token_count: Optional[int] = None
    ) -> ChatMessage:
        """Add a message to a chat session"""
        async with async_session_maker() as session:
            # Verify session exists
            stmt = select(ChatSession).where(ChatSession.id == session_id)
            result = await session.execute(stmt)
            chat_session = result.scalar_one_or_none()
            
            if not chat_session:
                raise ValueError(f"Session {session_id} not found")
            
            # Create message
            chat_message = ChatMessage(
                session_id=session_id,
                role=role,
                content=content,
                token_count=token_count
            )
            session.add(chat_message)
            
            # Update session updated_at
            chat_session.updated_at = datetime.utcnow()
            
            await session.commit()
            await session.refresh(chat_message)
            return chat_message

    async def deleteSession(
        self, 
        session_id: str, 
        user_id: str
    ):
        """Delete a chat session and all its messages"""
        async with async_session_maker() as session:
            # Verify session belongs to user
            stmt = select(ChatSession).where(
                ChatSession.id == session_id,
                ChatSession.user_id == user_id
            )
            result = await session.execute(stmt)
            chat_session = result.scalar_one_or_none()
            
            if not chat_session:
                raise ValueError(f"Session {session_id} not found or access denied")
            
            # Delete messages first (due to foreign key constraint)
            msg_stmt = select(ChatMessage).where(ChatMessage.session_id == session_id)
            msg_result = await session.execute(msg_stmt)
            messages = msg_result.scalars().all()
            
            for message in messages:
                await session.delete(message)
            
            # Delete session
            await session.delete(chat_session)
            await session.commit()