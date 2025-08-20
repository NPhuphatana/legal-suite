import json
import sqlite3
from typing import List, Tuple

try:
    import openai
except ImportError:  # pragma: no cover
    openai = None

DB_PATH = "embeddings.db"


def _ensure_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "CREATE TABLE IF NOT EXISTS embeddings (doc_id TEXT, chunk TEXT, vector TEXT)"
    )
    conn.commit()
    conn.close()


def embed_chunks(chunks: List[str], doc_id: str) -> None:
    """Generate embeddings for chunks and store them in SQLite."""
    if not openai:
        raise ImportError("openai package required for embeddings")
    _ensure_db()
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    for chunk in chunks:
        resp = openai.Embedding.create(model="text-embedding-3-small", input=chunk)
        vec = resp["data"][0]["embedding"]
        cur.execute(
            "INSERT INTO embeddings (doc_id, chunk, vector) VALUES (?, ?, ?)",
            (doc_id, chunk, json.dumps(vec)),
        )
    conn.commit()
    conn.close()


def _cosine(v1: List[float], v2: List[float]) -> float:
    import math

    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a in v1))
    norm2 = math.sqrt(sum(b * b for b in v2))
    return dot / (norm1 * norm2)


def query_similar_chunks(question: str, doc_id: str, top_k: int = 3) -> List[str]:
    """Retrieve top-k similar chunks for the question."""
    if not openai:
        return []
    _ensure_db()
    q_vec = openai.Embedding.create(
        model="text-embedding-3-small", input=question
    )["data"][0]["embedding"]
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT chunk, vector FROM embeddings WHERE doc_id=?", (doc_id,))
    scored: List[Tuple[float, str]] = []
    for chunk, vec_json in cur.fetchall():
        vec = json.loads(vec_json)
        score = _cosine(q_vec, vec)
        scored.append((score, chunk))
    conn.close()
    scored.sort(reverse=True)
    return [c for _, c in scored[:top_k]]
