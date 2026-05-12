import asyncio
import logging
from typing import Optional
import PyPDF2
import docx
import markdown
from app.models.document import Document

logger = logging.getLogger(__name__)


class ParsingService:
    def __init__(self):
        self.supported_types = {
            'application/pdf': self._parse_pdf,
            'text/plain': self._parse_text,
            'text/markdown': self._parse_markdown,
        }

    async def parse_document(self, file_path: str, mime_type: str) -> str:
        """
        Parse document based on MIME type and return extracted text
        """
        if mime_type not in self.supported_types:
            raise ValueError(f"Unsupported MIME type: {mime_type}")
            
        try:
            parser_func = self.supported_types[mime_type]
            text = await parser_func(file_path)
            return text
        except Exception as e:
            logger.error(f"Error parsing document {file_path}: {str(e)}")
            raise

    async def _parse_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        def _extract_pdf():
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            return text
        
        # Run in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _extract_pdf)

    async def _parse_text(self, file_path: str) -> str:
        """Extract text from plain text file"""
        async with asyncio.Lock():  # Simple file read, but using lock for consistency
            async with aiofiles.open(file_path, 'r', encoding='utf-8') as file:
                return await file.read()

    async def _parse_markdown(self, file_path: str) -> str:
        """Extract text from markdown file"""
        # First read the markdown content
        async with aiofiles.open(file_path, 'r', encoding='utf-8') as file:
            md_content = await file.read()
        
        # Convert markdown to HTML then extract text (simplified)
        # In production, you might want to use a proper markdown parser
        html = markdown.markdown(md_content)
        # Very basic HTML tag removal - in production use BeautifulSoup or similar
        import re
        text = re.sub('<[^<]+?>', '', html)
        return text