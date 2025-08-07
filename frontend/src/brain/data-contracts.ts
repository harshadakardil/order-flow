/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** OrderCreate */
export interface OrderCreate {
  /** Customername */
  customerName: string;
  /** Orderamount */
  orderAmount: number;
}

/** OrderResponse */
export interface OrderResponse {
  /** Orderid */
  orderId: string;
  /** Customername */
  customerName: string;
  /** Orderamount */
  orderAmount: number;
  /**
   * Orderdate
   * @format date-time
   */
  orderDate: string;
  /** Status */
  status: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export interface GetOrdersParams {
  /**
   * Customer Name
   * Filter by customer name (case-insensitive)
   */
  customer_name?: string | null;
  /**
   * Status
   * Filter by order status
   */
  status?: string | null;
}

/** Response Get Orders */
export type GetOrdersData = OrderResponse[];

export type GetOrdersError = HTTPValidationError;

export type CreateOrderData = OrderResponse;

export type CreateOrderError = HTTPValidationError;
