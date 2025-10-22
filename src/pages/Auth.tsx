import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Apple } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in with Google",
        duration: 4000,
      });
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in with Apple",
        duration: 4000,
      });
    }
  };

  const handleEmailContinue = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your email address",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Send magic link
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign in",
        duration: 4000,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send magic link",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Helmet>
        <title>Sign In | FloridaHomeFinder.com</title>
        <meta name="description" content="Continue your home search on FloridaHomeFinder" />
      </Helmet>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Continue Your Home Search.
          </h1>
        </div>

        <div className="space-y-4">
          {/* Google Sign In */}
          <Button
            variant="outline"
            className="w-full h-14 text-base border-2 hover:bg-muted"
            onClick={handleGoogleSignIn}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>

          {/* Apple Sign In */}
          <Button
            className="w-full h-14 text-base bg-black hover:bg-black/90 text-white"
            onClick={handleAppleSignIn}
          >
            <Apple className="w-5 h-5 mr-3" />
            Sign in with Apple
          </Button>

          {/* OR Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm font-semibold text-muted-foreground">
                OR
              </span>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEmailContinue();
                }
              }}
            />
            <Button
              className="w-full h-14 text-base bg-primary hover:bg-primary/90"
              onClick={handleEmailContinue}
              disabled={isLoading}
            >
              {isLoading ? "SENDING..." : "CONTINUE WITH EMAIL"}
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Returning User? </span>
            <button
              onClick={() => navigate("/auth")}
              className="font-semibold underline hover:text-primary"
            >
              Login Here
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="text-xs text-muted-foreground leading-relaxed space-y-3 pt-6">
          <p>
            By registering on the FloridaHomeFinder.com website, you consent to receive calls, texts, and emails from{" "}
            <span className="font-semibold text-foreground">FloridaHomeFinder</span> regarding real estate-related matters. This consent allows{" "}
            <span className="font-semibold text-foreground">FloridaHomeFinder</span> to contact you in compliance with the Telephone Consumer Protection Act (TCPA) guidelines. We adhere to TCPA and Do Not Call (DNC) guidelines as of October 21, 2025. Your consent is crucial for us to provide you with timely and relevant information about your real estate needs.
          </p>
          <p>
            Please be aware that <span className="font-semibold text-foreground">FloridaHomeFinder</span> may utilize SMS/MMS communications, AI generative voice technology, and marketing communications as part of this consent. Automated technology may be employed in communications, and consent is not a condition to obtain any goods, services, or credit. Additionally,{" "}
            <span className="font-semibold text-foreground">FloridaHomeFinder</span> may use pre-recorded or artificial voice messages in outreach efforts.
          </p>
          <p>
            You can revoke this consent at any time by following the opt-out instructions provided in our communications.
          </p>
          <p>
            Thank you for choosing <span className="font-semibold text-foreground">FloridaHomeFinder</span> as your trusted real estate partner in Florida.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
