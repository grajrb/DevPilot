import asyncio
import aiofiles
import logging
import re
from typing import Optional

logger = logging.getLogger(__name__)


class ParsingService:
    def __init__(self):
        self.supported_types = {
            'application/pdf': self._parse_pdf,
            'text/plain': self._parse_text,
            'text/markdown': self._parse_markdown,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': self._parse_docx,
        }

    async def parse_document(self, file_path: str, mime_type: str) -> str:
        """Parse document based on MIME type and return extracted text"""
        parser_func = self.supported_types.get(mime_type)
        if not parser_func:
            # Fallback to text parsing for unknown types
            logger.warning(f"Unsupported MIME type {mime_type}, falling back to text")
            parser_func = self._parse_text

        try:
            text = await parser_func(file_path)
            logger.info(f"Successfully parsed {file_path} ({len(text)} chars)")
            return text
        except Exception as e:
            logger.error(f"Error parsing document {file_path}: {str(e)}")
            raise

    async def _parse_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        def _extract_pdf():
            try:
                import PyPDF2
                text = ""
                with open(file_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page in pdf_reader.pages:
                        extracted = page.extract_text()
                        if extracted:
                            text += extracted + "\n"
                return text if text else "[PDF could not be parsed - no extractable text]"
            except ImportError:
                return f"[PDF parsing library not available. File: {file_path}]"
            except Exception as e:
                return f"[PDF parsing error: {str(e)}]"

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _extract_pdf)

    async def _parse_text(self, file_path: str) -> str:
        """Extract text from plain text file"""
        try:
            async with aiofiles.open(file_path, 'r', encoding='utf-8') as file:
                return await file.read()
        except UnicodeDecodeError:
            # Fallback to latin-1
            async with aiofiles.open(file_path, 'r', encoding='latin-1') as file:
                return await file.read()

    async def _parse_markdown(self, file_path: str) -> str:
        """Extract text from markdown file"""
        try:
            async with aiofiles.open(file_path, 'r', encoding='utf-8') as file:
                md_content = await file.read()
            # Strip markdown formatting for plain text
            text = re.sub(r'#{1,6}\s+', '', md_content)
            text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
            text = re.sub(r'\*(.*?)\*', r'\1', text)
            text = re.sub(r'`{1,3}(.*?)`{1,3}', r'\1', text)
            text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
            text = re.sub(r'[-*+]\s+', '', text)
            text = re.sub(r'\n{3,}', '\n\n', text)
            return text.strip()
        except Exception as e:
            logger.error(f"Error parsing markdown: {str(e)}")
            return f"[Error parsing markdown file: {str(e)}]"

    async def _parse_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        def _extract_docx():
            try:
                import docx
                doc = docx.Document(file_path)
                text = "\n".join([para.text for para in doc.paragraphs])
                return text if text else "[DOCX contained no extractable text]"
            except ImportError:
                return f"[DOCX parsing library not available. File: {file_path}]"
            except Exception as e:
                return f"[DOCX parsing error: {str(e)}]"

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _extract_docx)

    def get_supported_formats(self) -> list:
        """Return list of supported file extensions"""
        return ['.pdf', '.txt', '.md', '.docx']