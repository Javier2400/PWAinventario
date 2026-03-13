from fastapi import APIRouter
from backend.models.product import Product
from backend.services.product_service import get_products, add_product, delete_product

router = APIRouter()

@router.get("/")
def list_products():
    return get_products()

@router.post("/")
def create_product(product: Product):
    return add_product(product)

@router.delete("/{product_id}")
def remove_product(product_id: int):
    return delete_product(product_id)