from typing import List
from app.models.product import Product

products_db: List[Product] = []

def get_products():
    return products_db

def add_product(product: Product):
    product.id = len(products_db) + 1
    products_db.append(product)
    return product

def delete_product(product_id: int):
    global products_db
    products_db = [p for p in products_db if p.id != product_id]
    return {"message": "Producto eliminado"}