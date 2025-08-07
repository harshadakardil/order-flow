import { UserButton, useUser } from "@stackframe/react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const user = useUser();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between p-4 bg-background border-b">
      <h1 className="text-2xl font-bold text-foreground">OrderFlow</h1>
      <div>
        {user ? (
          <UserButton />
        ) : (
          <Button onClick={() => navigate("/auth/sign-in")} variant="outline">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
