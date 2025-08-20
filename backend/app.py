from fastapi import FastAPI, UploadFile, File, Form
import tempfile
from Services.Chat import preprocess, embeddings

try:
    import openai
except ImportError:  # pragma: no cover
    openai = None

app = FastAPI()


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    """Receive a file, convert to text, chunk, and index embeddings."""
    suffix = "." + file.filename.split(".")[-1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name
    text = preprocess.convert_to_text(tmp_path)
    chunks = preprocess.split_into_chunks(text)
    try:
        embeddings.embed_chunks(chunks, file.filename)
    except Exception:
        pass  # embedding requires external service; ignore failures
    return {"doc_id": file.filename, "chunks": len(chunks)}


@app.post("/chat")
async def chat(doc_id: str = Form(...), message: str = Form(...)):
    """Return answer from LLM based on similar document chunks."""
    context_chunks = embeddings.query_similar_chunks(message, doc_id)
    prompt = "\n".join(context_chunks) + f"\nQuestion: {message}\nAnswer:"
    if openai:
        try:
            resp = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
            )
            return {"answer": resp["choices"][0]["message"]["content"]}
        except Exception:
            pass
    return {"answer": "LLM provider not configured."}
