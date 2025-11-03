import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import RegistrationModal from "./RegistrationModal";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthGateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  blur?: boolean;
}

export const AuthGate = ({ 
  children, 
  title = "Sign in to view this content",
  description = "Create a free account to access premium property data and features",
  blur = true 
}: AuthGateProps) => {
  const { isAuthenticated, loading } = useAuthCheck();
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="relative">
        <div className={blur ? "blur-sm pointer-events-none select-none" : "opacity-50 pointer-events-none select-none"}>
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center space-y-4 p-6 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-2">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            <Button 
              size="lg"
              onClick={() => setShowModal(true)}
              className="mt-4"
            >
              Sign In / Register
            </Button>
          </div>
        </div>
      </div>

      <RegistrationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => setShowModal(false)}
      />
    </>
  );
};
