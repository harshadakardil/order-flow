
import React, { useState } from "react";
import Header from "components/Header";
import OrdersTable from "components/OrdersTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, PlusCircle, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";
import { useUser } from "@stackframe/react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const user = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Show a loading state while the user session is being determined
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // If the user is not logged in, show a welcome message and a login button
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-3xl font-bold mb-4">Welcome to OrderFlow</h2>
          <p className="text-muted-foreground mb-8">
            Please log in to manage your orders.
          </p>
          <Button onClick={() => navigate("/auth/sign-in")}>
            <LogIn className="mr-2 h-4 w-4" />
            Proceed to Login
          </Button>
        </main>
      </div>
    );
  }

  // If the user is logged in, display the main dashboard
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Dashboard
            </h2>
            <p className="text-muted-foreground">
              Welcome back! Here's a list of all orders.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate("/createorder")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders by customer or ID..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["All", "Completed", "Processing", "Pending", "Cancelled"].map(
                (status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter === status}
                    onSelect={() => setStatusFilter(status)}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <OrdersTable searchTerm={searchTerm} statusFilter={statusFilter} />
      </main>
    </div>
  );
}
