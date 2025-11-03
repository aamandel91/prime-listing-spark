import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { makeFirstUserAdmin } from "@/utils/makeFirstUserAdmin";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for password recovery event FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowUpdatePassword(true);
        if (window.location.pathname !== '/auth') {
          navigate('/auth', { replace: true });
        }
      }
    });

    // THEN check existing session and URL state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (window.location.hash.includes('type=recovery')) {
        setShowUpdatePassword(true);
        return;
      }

      // Do not auto-redirect away when user is on the auth page
      if (window.location.pathname === '/auth') return;

      if (session && !showUpdatePassword) {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, showUpdatePassword]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both email and password",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in",
        duration: 3000,
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message || "Invalid email or password",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both email and password",
        duration: 4000,
      });
      return;
    }

    if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 8 characters",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      // Automatically make first user an admin
      if (data.user) {
        const wasGrantedAdmin = await makeFirstUserAdmin(data.user.id);
        
        toast({
          title: "Account created!",
          description: wasGrantedAdmin 
            ? "You've been granted admin access as the first user!" 
            : "You've successfully signed up",
          duration: 4000,
        });
      } else {
        toast({
          title: "Account created!",
          description: "You've successfully signed up",
          duration: 3000,
        });
      }
      
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message || "Failed to create account",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a password reset link",
        duration: 4000,
      });
      
      setShowResetPassword(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: error.message || "Failed to send reset email",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter and confirm your new password",
        duration: 4000,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
        duration: 4000,
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 8 characters",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password updated!",
        description: "Your password has been successfully reset",
        duration: 3000,
      });
      
      setShowUpdatePassword(false);
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update password",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Helmet>
        <title>Admin Access | FloridaHomeFinder.com</title>
        <meta name="description" content="Admin access for FloridaHomeFinder" />
      </Helmet>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            Admin Access
          </h1>
          <p className="text-muted-foreground">
            Sign in to manage your real estate platform
          </p>
        </div>

        {showUpdatePassword ? (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold mb-2">Set New Password</h2>
              <p className="text-sm text-muted-foreground">
                Enter your new password below
              </p>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password (min 8 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-12"
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12"
                  required
                  minLength={8}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        ) : !showResetPassword ? (
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm"
                    onClick={() => setShowResetPassword(true)}
                  >
                    Forgot your password?
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                    required
                    minLength={8}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  After signup, contact an admin to grant you access permissions
                </p>
              </form>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold mb-2">Reset Password</h2>
              <p className="text-sm text-muted-foreground">
                Enter your email and we'll send you a reset link
              </p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm"
                  onClick={() => setShowResetPassword(false)}
                >
                  ← Back to Sign In
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => navigate("/")}
            className="text-sm"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
