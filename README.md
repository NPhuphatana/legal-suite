# Legal Suite

## Running

### Backend
1. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. Start the API:
   ```bash
   uvicorn app:app --app-dir backend --reload
   ```
   The service logs requests and reports unhandled errors as 500 responses.

### Frontend
1. Change to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install packages and build static assets:
   ```bash
   npm install
   npm run build
   ```
   Built files are written to `frontend/dist`.

## Development
- Backend code lives in `backend/`. The FastAPI app provides request logging and basic error handling out of the box.
- Frontend static assets live in `frontend/`. Update `index.html` and rebuild with `npm run build`.

## Packaging
The project ships with cross‑platform build scripts that assemble backend and frontend artifacts.

- Unix/macOS:
  ```bash
  ./build.sh
  ```
- Windows:
  ```powershell
  pwsh build.ps1
  ```

The resulting archive (`legal-suite.tar.gz` on Unix or `legal-suite.zip` on Windows) contains the published backend, built frontend, and can be deployed as needed.
