import { CheckHealthData, CreateOrderData, GetOrdersData, OrderCreate } from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Retrieve all orders, with optional filtering.
   * @tags Orders, dbtn/module:orders, dbtn/hasAuth
   * @name get_orders
   * @summary Get Orders
   * @request GET:/routes/orders
   */
  export namespace get_orders {
    export type RequestParams = {};
    export type RequestQuery = {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetOrdersData;
  }

  /**
   * @description Create a new order.
   * @tags Orders, dbtn/module:orders, dbtn/hasAuth
   * @name create_order
   * @summary Create Order
   * @request POST:/routes/orders
   */
  export namespace create_order {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = OrderCreate;
    export type RequestHeaders = {};
    export type ResponseBody = CreateOrderData;
  }
}
