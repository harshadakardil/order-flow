
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import brain from "brain";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Header from "components/Header";
import { useUserGuardContext } from "app/auth";

const formSchema = z.object({
  customerName: z.string().min(2, "Customer name must be at least 2 characters."),
  orderAmount: z.coerce.number().positive("Order amount must be a positive number."),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateOrderPage() {
  useUserGuardContext();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      orderAmount: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await brain.create_order({
        customerName: values.customerName,
        orderAmount: values.orderAmount,
      });
      toast.success("Your order has been created successfully.");
      navigate("/");
    } catch (error) {
      toast.error("There was a problem with your request.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Create a New Order</CardTitle>
            <CardDescription>
              Fill out the form below to add a new order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  placeholder="John Doe"
                  {...form.register("customerName")}
                />
                {form.formState.errors.customerName && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.customerName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderAmount">Order Amount</Label>
                <Input
                  id="orderAmount"
                  type="number"
                  placeholder="100.00"
                  step="0.01"
                  {...form.register("orderAmount")}
                />
                {form.formState.errors.orderAmount && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.orderAmount.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Create Order
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
