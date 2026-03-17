# Fixed pip install error - Progress Tracker

## Plan Steps:

1. ✅ Create this TODO.md
2. Edit root `requirements.txt`: Remove `annotated-docs==0.0.4`
3. Edit `backend/requirements.txt`: Remove `annotated-docs==0.0.4`
4. Setup Python venv: `cd backend && python -m venv venv`
5. Activate venv and install: `pip install -r requirements.txt`
6. Verify: Backend starts with `uvicorn main:app --reload`
7. Optional: Remove/clean root requirements.txt (redundant)

Updated as steps complete.

