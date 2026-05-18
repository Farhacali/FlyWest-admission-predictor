# FlyWest Admission Predictor

AI-powered study abroad admission predictor built for **DojoWorks internship** — helps students estimate admission probability and discover matching universities.

## Live demo

> After deployment, add your URL here: `https://your-app.onrender.com`

## Features

- **Profile analysis** — GRE, TOEFL, CGPA, work experience, country & course
- **ML prediction** — Flask service with trained scikit-learn model
- **University recommendations** — 39 global universities with rankings, tuition, tiers, programs
- **Dashboard** — Rich cards with shortlist and counselor contact
- **University Explorer** — Search and filter by country, tier, budget, program

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, React Router, Recharts |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| ML | Python, Flask, scikit-learn, joblib |

## Project structure

```
admission-predictor/
├── frontend/          # React UI
├── backend/           # Express API + MongoDB
├── ml-service/        # Flask ML predictions
├── render.yaml        # One-click deploy config
├── DEPLOYMENT.md      # Step-by-step deploy guide
└── DOJOWORKS_SUBMISSION.md
```

## Run locally

**Prerequisites:** Node.js 20+, Python 3.11+, MongoDB (local or Atlas)

```powershell
# 1. ML service
cd ml-service
.\venv\Scripts\activate   # or: python -m venv venv && pip install -r requirements.txt
python app.py             # http://localhost:5000

# 2. Backend
cd backend
copy .env.example .env    # set MONGODB_URI
npm install
npm run seed              # first time only
npm start                 # http://localhost:4000

# 3. Frontend
cd frontend
npm install
npm run dev               # http://localhost:5173
```

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict` | Get admission chance + university matches |
| GET | `/api/universities` | List/filter universities |
| GET | `/api/history` | Recent predictions |
| GET | `/api/health` | Health check |

## Deploy

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Render + MongoDB Atlas (free tier).

## Submit to DojoWorks

See **[DOJOWORKS_SUBMISSION.md](./DOJOWORKS_SUBMISSION.md)** for ZIP creation and submission template.

## Author

Internship project — DojoWorks
