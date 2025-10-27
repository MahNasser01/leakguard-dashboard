import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Auth() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sign-in");

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, isLoaded, navigate]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">LeakGuard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Secure your data with AI-powered leak detection
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sign-in" className="mt-6">
            <div className="flex justify-center">
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-card shadow-none",
                  }
                }}
                routing="hash"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="sign-up" className="mt-6">
            <div className="flex justify-center">
              <SignUp 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-card shadow-none",
                  }
                }}
                routing="hash"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
