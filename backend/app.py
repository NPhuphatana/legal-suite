import logging
import tempfile
from fastapi import FastAPI, Request, UploadFile, File, Form
from fastapi.responses import JSONResponse

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("legal_suite")

try:
    from Services.Chat import preprocess, embeddings
except Exception:
    preprocess = None
    embeddings = None

try:
    import openai
except Exception:
    openai = None

app = FastAPI()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info("%s %s", request.method, request.url.path)
    try:
        response = await call_next(request)
    except Exception:
        logger.exception("Unhandled exception")
        return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})
    return response

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    suffix = "." + file.filename.split(".")[-1] if "." in file.filename else ""
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name
    if not preprocess:
        return JSONResponse(status_code=501, content={"detail": "Preprocessing unavailable"})
    text = preprocess.convert_to_text(tmp_path)
    chunks = preprocess.split_into_chunks(text)
    if embeddings:
        try:
            embeddings.embed_chunks(chunks, file.filename)
        except Exception:
            pass
    return {"doc_id": file.filename, "chunks": len(chunks)}

@app.post("/chat")
async def chat(doc_id: str = Form(...), message: str = Form(...)):
    if not embeddings:
        return {"answer": "Embedding service unavailable."}
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
