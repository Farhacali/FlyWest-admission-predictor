# DojoWorks Internship — Submission Checklist

## What to send DojoWorks

| Item | What to provide |
|------|-----------------|
| **Live demo URL** | Your deployed frontend, e.g. `https://flywest-web.onrender.com` |
| **Source code (ZIP)** | Run `scripts\create-submission-zip.ps1` → upload `FlyWest-Admission-Predictor-Submit.zip` |
| **GitHub (optional)** | Repo link if they accept it instead of ZIP |

---

## Create the upload ZIP

In PowerShell:

```powershell
cd "c:\Users\farha\.vscode\admission predictor"
.\scripts\create-submission-zip.ps1
```

Output file: `FlyWest-Admission-Predictor-Submit.zip` (in project root)

The ZIP includes source code and docs. It **excludes** `node_modules`, `venv`, and `.env` files (secrets stay local).

---

## Suggested submission email / message

```
Subject: Internship Project Submission — FlyWest Admission Predictor

Hi DojoWorks team,

Please find my internship project submission below.

Live demo: https://YOUR-FRONTEND-URL.onrender.com

Project: FlyWest Admission Predictor
- Students enter GRE, TOEFL, CGPA, and study preferences
- ML service predicts admission probability
- Backend recommends universities from a MongoDB database (39 institutions)
- React dashboard with rich university cards and a filterable explorer

Tech stack: React (Vite), Node.js (Express), MongoDB, Python (Flask + scikit-learn)

Attached: FlyWest-Admission-Predictor-Submit.zip (full source code)

GitHub (if applicable): https://github.com/YOUR_USERNAME/flywest-admission-predictor

Thank you,
[Your Name]
```

---

## Before you submit — 5-minute test

- [ ] Frontend URL loads
- [ ] Submit prediction → Dashboard shows % and university cards
- [ ] Explore Universities page shows 39 schools
- [ ] ZIP file opens and contains `README.md`, `backend/`, `frontend/`, `ml-service/`
- [ ] No passwords in ZIP (no `.env` files)

---

## If live URL is slow on first click

Render free tier sleeps after ~15 minutes idle. Tell reviewers: *"First load may take up to 1 minute while services wake up."*
