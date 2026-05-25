# Multimodal Document Analyzer

A full-stack SaaS-style app for uploading PDFs, DOCX, TXT, JPG, PNG, and scanned documents, extracting text with OCR, storing data in MongoDB, and generating AI summaries using the Grok API.

## Features

- JWT-based auth with register/login/profile
- Drag-and-drop multi-format uploads
- Secure backend with Helmet, rate limiting, and file validation
- Tesseract OCR integration for image text extraction
- AI analysis via Grok API for summaries, keywords, entities, sentiment, and insights
- Chat interface for asking questions on uploaded documents
- Document management, search, filters, analytics, and dashboard UI
- Dark mode, glassmorphism visuals, responsive layout, and skeleton loaders

## Folder structure

- `backend/` - Express API, MongoDB models, services, and middleware
- `frontend/` - Vite + React + Tailwind CSS SPA

## Setup

### Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example` and fill in values.
4. Start backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example` if needed.
4. Start frontend dev server:
   ```bash
   npm run dev
   ```

## Environment variables

Backend `.env` values:

- `GROK_API_KEY` - Your Grok API key
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token signing
- `PORT` - Backend port (defaults to 5000)

Frontend `.env` values:

- `VITE_API_BASE_URL` - Backend API URL (default `http://localhost:5000/api`)

## Deployment

- Frontend: Vercel or any static host for Vite build
- Backend: Render, Heroku, or any Node + MongoDB service

## Notes

- Uploaded files are stored in `backend/uploads`
- Document OCR and AI analysis are performed on file upload, with refresh support
- Chat history is persisted per document and user
