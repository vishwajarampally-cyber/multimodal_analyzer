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

## Vercel deployment

This repo is configured to deploy the Vite frontend and Express backend together on Vercel:

- Frontend build output is served from `frontend/dist`
- Backend requests to `/api/*` are handled by the serverless function in `api/index.js`
- In production, the frontend API client defaults to same-origin `/api`

Set these Vercel environment variables:

- `MONGODB_URI` - Required MongoDB Atlas or other hosted MongoDB connection string
- `GROK_API_KEY` - Optional Grok API key for AI analysis
- `GROK_API_URL` - Optional override for the Grok endpoint

Vercel serverless functions only provide temporary filesystem storage. Uploaded files are processed during the request and document metadata/extracted text are stored in MongoDB. Use object storage such as S3, Cloudinary, or Vercel Blob if you need durable file downloads.

## Notes

- Uploaded files are stored in `backend/uploads`
- Document OCR and AI analysis are performed on file upload, with refresh support
- Chat history is persisted per document and user
