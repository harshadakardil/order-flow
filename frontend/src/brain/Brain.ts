import {
  CheckHealthData,
  CreateOrderData,
  CreateOrderError,
  GetOrdersData,
  GetOrdersError,
  GetOrdersParams,
  OrderCreate,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Retrieve all orders, with optional filtering.
   *
   * @tags Orders, dbtn/module:orders, dbtn/hasAuth
   * @name get_orders
   * @summary Get Orders
   * @request GET:/routes/orders
   */
  get_orders = (query: GetOrdersParams, params: RequestParams = {}) =>
    this.request<GetOrdersData, GetOrdersError>({
      path: `/routes/orders`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Create a new order.
   *
   * @tags Orders, dbtn/module:orders, dbtn/hasAuth
   * @name create_order
   * @summary Create Order
   * @request POST:/routes/orders
   */
  create_order = (data: OrderCreate, params: RequestParams = {}) =>
    this.request<CreateOrderData, CreateOrderError>({
      path: `/routes/orders`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
