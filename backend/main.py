from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Me Manager Backend Sidecar")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend sidecar is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
