# Fix ModuleNotFoundError: No module named 'app'

## Steps:
- [x] Edit backend/services/product_service.py: Fix import from app.models.product to backend.models.product
- [x] Edit backend/services/payment_service.py: Fix import from app.models.payment to backend.models.payment
- [x] Read and fix backend/services/stripe_service.py (fixed app.models.payment and app.services.payment_service)
- [x] Test locally (main.py moved to backend/main.py; cd backend & uvicorn main:app --reload --port 8000)
- [ ] Update container (docker compose up --build or similar)

