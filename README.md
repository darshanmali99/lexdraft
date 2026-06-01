<img width="1536" height="1024" alt="ChatGPT Image Jun 1, 2026, 11_47_37 AM" src="https://github.com/user-attachments/assets/d5b137a3-51d8-4d8c-beba-8e33c2fba8fa" />
# LexDraft

## Project Overview

LexDraft is a full-stack legal document generation platform built with a React/Vite frontend and an Express backend. It supports user authentication, document type and clause management, template uploads, semantic search through embeddings, and AI-powered legal document generation via the Groq API.

## Architecture

- `backend/` - Node.js + Express API server
- `frontend/` - React app built with Vite
- `lexdraft_backup.sql` - PostgreSQL backup file for database schema/data

## Key Features

- User registration and login
- JWT-protected routes
- Document type and clause management
- Template upload support (`.pdf` / `.docx`) with processing
- Company settings and branding storage
- Legal document generation pipeline using:
  - RAG retrieval of clauses
  - Prompt building
  - Groq API text generation
- Document preview and export (PDF/DOCX)
- Embedding job management and semantic search
- Dashboard and admin-style knowledge base management

## Folder Structure

```
backend/
  src/
    api/routes/index.js
    config/db.js
    config/multer.js
    controllers/
      authController.js
      documentController.js
      embeddingController.js
      knowledgeBaseController.js
    middleware/auth.js
    routes/
      authRoutes.js
      protectedRoutes.js
      knowledgeBaseRoutes.js
      embeddingRoutes.js
      documentRoutes.js
      dashboardRoutes.js
    services/
      documentGenerationService.js
      embeddingService.js
      groqService.js
      promptBuilder.js
      ragService.js
      ...
frontend/
  src/
    api/axios.js
    components/
    pages/
      DashboardPage.jsx
      DocumentsPage.jsx
      GeneratePage.jsx
      KnowledgeBasePage.jsx
      LoginPage.jsx
      RegisterPage.jsx
      SettingsPage.jsx
    ...
```

## Setup Instructions

### Prerequisites

- Node.js
- npm
- PostgreSQL
- Groq API key

### Backend Setup

1. Open a terminal and go to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure PostgreSQL:
   - Ensure a PostgreSQL database named `lexdraft` exists.
   - The current database settings are hardcoded in `backend/src/config/db.js`:
     - user: `postgres`
     - host: `localhost`
     - database: `lexdraft`
     - password: `password`
     - port: `5432`
   - Adjust these values in `backend/src/config/db.js` if your environment differs.
4. Create a `.env` file in `backend/` with at least:
   ```env
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   GROQ_API_KEY=your_groq_api_key
   GROQ_MODEL=llama-3.3-70b-versatile
   GROQ_TEMPERATURE=0.2
   GROQ_MAX_TOKENS=4096
   PORT=5000
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Open a separate terminal and go to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. The app expects the backend API at `http://localhost:5000/api` by default. This is set in `frontend/src/api/axios.js`.

## Running the App

- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`

Open the frontend URL printed by Vite (typically `http://localhost:5173`).

## Backend API Overview

### Authentication

- `POST /api/auth/register` - create a new user
- `POST /api/auth/login` - authenticate and receive JWT token

### Protected Routes

- `GET /api/protected/dashboard` - test protected auth route

### Knowledge Base

- `POST /api/kb/document-types` - create document type
- `GET /api/kb/document-types` - list document types
- `DELETE /api/kb/document-types/:id` - delete document type
- `POST /api/kb/clauses` - add clause
- `GET /api/kb/clauses` - list clauses
- `POST /api/kb/templates` - upload legal template file
- `GET /api/kb/templates` - list uploaded templates
- `POST /api/kb/settings` - save company settings
- `GET /api/kb/settings` - read company settings
- `POST /api/kb/settings/logo` - upload company logo

### Embeddings

- `POST /api/embeddings/start` - start embedding job
- `GET /api/embeddings/status/:id` - get embedding status
- `POST /api/embeddings/search` - semantic search
- `GET /api/embeddings/stats` - embedding statistics

### Documents

- `POST /api/documents/generate` - create a new legal document
- `GET /api/documents` - list documents
- `GET /api/documents/:id` - get document by ID
- `POST /api/documents/:id/regenerate` - regenerate existing document
- `PATCH /api/documents/:id/status` - update document status
- `DELETE /api/documents/:id` - delete / archive document
- `GET /api/documents/:id/export/docx` - download DOCX export
- `GET /api/documents/:id/export/pdf` - download PDF export
- `GET /api/documents/:id/export/preview` - preview generated document
- `GET /api/documents/test-groq` - test Groq connection

## Frontend Overview

Main pages:

- `LoginPage` / `RegisterPage` - authentication
- `DashboardPage` - overview and stats
- `DocumentsPage` - document list and details
- `GeneratePage` - generate AI-assisted legal documents
- `KnowledgeBasePage` - manage types, clauses, templates, and settings
- `SettingsPage` - company and branding settings

Auth flow:

- JWT is stored in `localStorage`
- Axios interceptor adds `Authorization: Bearer <token>` to API requests

## Notes for Handover

- The backend uses JWT auth and relies on `process.env.JWT_SECRET`
- Document generation depends on the Groq API via `backend/src/services/groqService.js`
- The knowledge base supports templates and clause retrieval for RAG-driven generation
- `uploads/` is served as static content from the backend
- Database backup is available at `lexdraft_backup.sql`
- `frontend/README.md` is the default Vite starter README and is not specific to LexDraft

## Recommended Next Steps

- Add environment-driven DB configuration to `backend/src/config/db.js`
- Add documentation for database schema and migration process
- Add seed data for document types, clauses, and company settings
- Replace hardcoded CORS origin if deploying to production

---

If you need specific deployment instructions, I can also add a production deployment section for Docker, cloud hosting, or environment management.
