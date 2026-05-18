# Deploy FlyWest Admission Predictor (Render + MongoDB Atlas)

Free-tier deployment suitable for DojoWorks internship submission.

## What you will get

| Service | Platform | URL example |
|---------|----------|-------------|
| Frontend | Render Static Site | `https://flywest-web.onrender.com` |
| Backend API | Render Web Service | `https://flywest-api.onrender.com` |
| ML Service | Render Web Service | `https://flywest-ml.onrender.com` |
| Database | MongoDB Atlas | (connection string only) |

**Submit this URL to DojoWorks:** your **frontend** URL (`flywest-web`).

---

## Step 1 — Push code to GitHub

1. Create a repo on [github.com](https://github.com) (e.g. `flywest-admission-predictor`).
2. In PowerShell:

```powershell
cd "c:\Users\farha\.vscode\admission predictor"
git init
git add .
git commit -m "FlyWest admission predictor - internship submission"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flywest-admission-predictor.git
git push -u origin main
```

> `ml-service/admission_model.pkl` (~11 MB) must be committed so the ML service can load the model on Render.

---

## Step 2 — MongoDB Atlas (free database)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → **Sign up**.
2. Create a **free M0 cluster**.
3. **Database Access** → Add user (username + password). Save the password.
4. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) for Render.
5. **Database** → **Connect** → **Drivers** → copy connection string.
6. Replace `<password>` with your user password and set database name:

```
mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/admission_predictor?retryWrites=true&w=majority
```

---

## Step 3 — Deploy on Render

1. Go to [render.com](https://render.com) → Sign up (GitHub login is easiest).
2. **New +** → **Blueprint** → Connect your GitHub repo.
3. Render reads `render.yaml` and creates 3 services.
4. When prompted, set **Environment Variables**:

### flywest-ml
No extra vars needed (uses `requirements.txt` + gunicorn).

### flywest-api
| Key | Value |
|-----|--------|
| `MONGODB_URI` | Your Atlas connection string from Step 2 |
| `ML_SERVICE_URL` | `https://flywest-ml.onrender.com` (use your actual ML URL after first deploy) |
| `FRONTEND_URL` | `https://flywest-web.onrender.com` (use your actual frontend URL) |

### flywest-web (Static Site)
| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://flywest-api.onrender.com` (your backend URL, **no** trailing slash) |

5. Click **Apply** and wait for all 3 deploys to finish (10–15 min first time).

### If Blueprint fails — deploy manually

Create **3 services** from the same repo:

**A. Web Service — ML** (`ml-service`)
- Build: `pip install -r requirements.txt`
- Start: `gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120`

**B. Web Service — API** (`backend`)
- Build: `npm install`
- Start: `npm start`
- Env: `MONGODB_URI`, `ML_SERVICE_URL`, `FRONTEND_URL`

**C. Static Site — Frontend** (`frontend`)
- Build: `npm install && npm run build`
- Publish: `dist`
- Env: `VITE_API_URL` = backend URL
- Add rewrite: `/*` → `/index.html`

---

## Step 4 — Seed universities (first time)

After `flywest-api` is live, open in browser or run:

```
https://YOUR-API-URL.onrender.com/api/universities
```

If you see `[]`, trigger seed locally once pointing at Atlas:

```powershell
cd backend
$env:MONGODB_URI="your-atlas-uri"
npm run seed
```

Or restart the API service — it auto-seeds when the collection is empty.

---

## Step 5 — Test live app

1. Open **frontend URL**.
2. **Get Started** → submit profile → check Dashboard cards.
3. **Explore Universities** → filters work.
4. First request after idle may take **30–60 seconds** (Render free tier cold start).

### Health checks
- API: `https://flywest-api.onrender.com/api/health`
- ML: `https://flywest-ml.onrender.com/health`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Prediction fails | Check `ML_SERVICE_URL` on API service; open ML `/health` |
| CORS error | Set `FRONTEND_URL` on API to exact frontend URL (https, no slash) |
| Empty universities | Run `npm run seed` with Atlas `MONGODB_URI` |
| 404 on page refresh | Static site needs rewrite to `index.html` (see `render.yaml`) |
| Build fails on frontend | Set `VITE_API_URL` **before** build; redeploy |

---

## Submit to DojoWorks

- **Live URL:** frontend Render URL  
- **Files:** run `scripts\create-submission-zip.ps1` (see `DOJOWORKS_SUBMISSION.md`)
