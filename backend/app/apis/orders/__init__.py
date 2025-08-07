

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
import asyncpg
import databutton as db
import uuid
from datetime import datetime

router = APIRouter()

class OrderCreate(BaseModel):
    customerName: str
    orderAmount: float

class OrderResponse(BaseModel):
    orderId: str
    customerName: str
    orderAmount: float
    orderDate: datetime
    status: str

@router.get("/orders", response_model=list[OrderResponse], tags=["Orders"])
async def get_orders(
    customer_name: str | None = Query(None, description="Filter by customer name (case-insensitive)"),
    status: str | None = Query(None, description="Filter by order status")
):
    """
    Retrieve all orders, with optional filtering.
    """
    try:
        conn = await asyncpg.connect(db.secrets.get("DATABASE_URL_DEV"))
        try:
            base_query = "SELECT * FROM orders"
            conditions = []
            params = []
            
            if customer_name:
                conditions.append("customer_name ILIKE $1")
                params.append(f"%{customer_name}%")
            
            if status:
                conditions.append(f"status = ${len(params) + 1}")
                params.append(status)

            if conditions:
                base_query += " WHERE " + " AND ".join(conditions)
            
            base_query += " ORDER BY created_at DESC"
            
            orders = await conn.fetch(base_query, *params)
        finally:
            await conn.close()

        return [
            OrderResponse(
                orderId=order['order_id'],
                customerName=order['customer_name'],
                orderAmount=order['order_amount'],
                orderDate=order['order_date'],
                status=order['status']
            )
            for order in orders
        ]
    except asyncpg.PostgresError as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")


@router.post("/orders", response_model=OrderResponse, tags=["Orders"])
async def create_order(order: OrderCreate):
    """
    Create a new order.
    """
    order_id = f"ORD-{str(uuid.uuid4()).split('-')[0].upper()}"
    order_date = datetime.utcnow()
    status = "Pending"

    try:
        conn = await asyncpg.connect(db.secrets.get("DATABASE_URL_DEV"))
        try:
            query = """
                INSERT INTO orders (order_id, customer_name, order_amount, order_date, status)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING order_id, customer_name, order_amount, order_date, status
            """
            new_order = await conn.fetchrow(
                query,
                order_id,
                order.customerName,
                order.orderAmount,
                order_date,
                status
            )
        finally:
            await conn.close()

        if new_order:
            return OrderResponse(
                orderId=new_order['order_id'],
                customerName=new_order['customer_name'],
                orderAmount=new_order['order_amount'],
                orderDate=new_order['order_date'],
                status=new_order['status']
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to create order.")

    except asyncpg.PostgresError as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
