import os
from typing import List

try:
    import docx
except ImportError:  # pragma: no cover
    docx = None

try:
    from PyPDF2 import PdfReader
except ImportError:  # pragma: no cover
    PdfReader = None


def convert_to_text(path: str) -> str:
    """Convert DOCX or PDF file to plain text."""
    ext = os.path.splitext(path)[1].lower()
    if ext == ".docx":
        if not docx:
            raise ImportError("python-docx not installed")
        document = docx.Document(path)
        return "\n".join(p.text for p in document.paragraphs)
    if ext == ".pdf":
        if not PdfReader:
            raise ImportError("PyPDF2 not installed")
        reader = PdfReader(path)
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    raise ValueError(f"Unsupported file type: {ext}")


def split_into_chunks(text: str, chunk_size: int = 500) -> List[str]:
    """Split text into chunks of roughly ``chunk_size`` characters."""
    return [text[i : i + chunk_size] for i in range(0, len(text), chunk_size)]
