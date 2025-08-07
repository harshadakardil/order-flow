



import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import brain from "brain";
import { OrderResponse } from "types";

type Status = "Completed" | "Processing" | "Pending" | "Cancelled";

const statusColors: Record<Status, string> = {
  Completed: "bg-green-100 text-green-800 border-green-200",
  Processing: "bg-blue-100 text-blue-800 border-blue-200",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

interface OrdersTableProps {
  searchTerm: string;
  statusFilter: string;
}

export default function OrdersTable({
  searchTerm,
  statusFilter,
}: OrdersTableProps) {
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params: { customer_name?: string; status?: string } = {};
        if (searchTerm) {
          params.customer_name = searchTerm;
        }
        if (statusFilter && statusFilter !== "All") {
          params.status = statusFilter;
        }

        const response = await brain.get_orders(params);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [searchTerm, statusFilter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>
          A list of all the orders in your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell className="font-medium">{order.orderId}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(order.orderAmount)}
                </TableCell>
                <TableCell>
                  {new Date(order.orderDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      statusColors[order.status as Status]
                    } hover:bg-opacity-80`}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
