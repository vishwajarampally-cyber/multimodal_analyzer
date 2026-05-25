# 🚀 DEPLOYMENT CHECKLIST

## ✅ BEFORE YOU START
- [ ] Code pushed to GitHub
- [ ] Have Grok API key ready
- [ ] Have MongoDB Atlas URL (or plan to use in-memory)
- [ ] GitHub personal access token created

---

## 📝 STEP 1: GET API CREDENTIALS

### Grok API Key
1. Go to https://console.groq.com
2. Sign up / Login
3. Click **API Keys**
4. Click **+ Create API Key**
5. Copy the key → **Save for Step 2**

### MongoDB URL (Optional - app works without it)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster
4. Click **Connect**
5. Choose **Drivers**
6. Copy connection string
7. Replace `<username>` and `<password>` with your credentials
8. Save → **For Step 2**

---

## 🚂 STEP 2: DEPLOY BACKEND TO RAILWAY

### 2.1 Create Railway Account
- Go to https://railway.app
- Click **Sign Up**
- Click **Continue with GitHub**
- Authorize Railway

### 2.2 Deploy Repository
- Click **+ New Project**
- Click **Deploy from GitHub repo**
- Search: `multimodal_analyzer`
- Click on it
- Click **Deploy**
- Wait for build (shows logs)

### 2.3 Add Environment Variables
- Go to your Railway project dashboard
- Click **Variables** tab (on the left)
- Click **+ New Variable** for each:

```
KEY: GROK_API_KEY
VALUE: sk-xxxxx... (from Step 1)

KEY: MONGODB_URI
VALUE: mongodb+srv://user:pass@... (from Step 1, or leave blank)

KEY: PORT
VALUE: 5000

KEY: NODE_ENV
VALUE: production
```

- Click **Save**
- Railway auto-redeploys ✅

### 2.4 Get Your Railway URL
- Go to **Deployments** tab
- Click the green ✅ deployment
- Copy the URL (like: `https://multimodal-analyzer-prod.up.railway.app`)
- **SAVE THIS URL for Step 3**

---

## ✨ STEP 3: DEPLOY FRONTEND TO VERCEL

### 3.1 Create Vercel Account
- Go to https://vercel.com
- Click **Sign Up**
- Click **Continue with GitHub**
- Authorize Vercel

### 3.2 Import Project
- Click **Add New** → **Project**
- Click **Import Git Repository**
- Search: `multimodal_analyzer`
- Click on it

### 3.3 Configure Build Settings
You should see this form:

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | (leave empty) |
| Install Command | (leave empty) |

- Click **Next** ✅

### 3.4 Add Environment Variable
- You'll see **Environment Variables** section
- Click **+ Add New**
- Fill in:
  - **Name:** `VITE_API_BASE_URL`
  - **Value:** Paste your Railway URL + `/api`
  
  Example: `https://multimodal-analyzer-prod.up.railway.app/api`

- Click **Add** ✅
- Click **Deploy**

### 3.5 Wait for Deployment
- Vercel will build (2-3 minutes)
- When done, you'll see ✅ and a link like:
  - `https://multimodal-analyzer.vercel.app`

---

## ✅ TEST YOUR DEPLOYMENT

### Test Backend
Open in browser:
```
https://your-railway-url/api/documents
```
Should show: `[]`

### Test Frontend
Open in browser:
```
https://your-vercel-url/documents
```
Try uploading a file → Should work! ✅

---

## 🎉 YOU'RE LIVE!

Your app is now deployed at:
- **Frontend:** `https://your-vercel-url` ← Share this with users
- **Backend:** `https://your-railway-url` ← Internal use only

---

## ⚠️ TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Build failed" on Vercel | Check Root Directory is set to `frontend` |
| "API not responding" | Check `VITE_API_BASE_URL` env var in Vercel matches your Railway URL |
| "502 Bad Gateway" on Railway | Wait 2-3 minutes, Railway might still be building |
| Upload doesn't work | Check GROK_API_KEY is correct in Railway |
| "Cannot find uploads folder" | Railway doesn't persist files. Add `MONGODB_URI` for persistent storage |

---

## 📱 NEXT STEPS (Optional)

- Add custom domain to Vercel
- Set up CI/CD pipeline
- Monitor logs in Railway dashboard
- Scale backend if needed

**Done! 🚀**
