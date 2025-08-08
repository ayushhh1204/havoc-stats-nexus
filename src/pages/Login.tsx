import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();

  useEffect(() => {
    if (user) {
      toast({ title: "Welcome back!", description: "You're now logged in." });
      navigate("/");
    }
  }, [user, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "sign-in") {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        toast({ title: "Login failed", description: error, variant: "destructive" });
      } else {
        toast({ title: "Logged in", description: "Redirecting..." });
        navigate("/");
      }
    } else {
      const { error } = await signUp(email.trim(), password);
      if (error) {
        toast({ title: "Sign up failed", description: error, variant: "destructive" });
      } else {
        toast({
          title: "Check your email",
          description: "We sent a confirmation link to finish signing up.",
        });
      }
    }

    setLoading(false);
  };

  return (
    <main className="container mx-auto py-10">
      <SEO title="Login" description="Player login to upload match results and stats." />
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Player {mode === "sign-in" ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            Use your team email and password. Only authorized HAVOC players may access uploads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : mode === "sign-in" ? "Login" : "Create account"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            {mode === "sign-in" ? (
              <button className="underline" onClick={() => setMode("sign-up")}>No account? Sign up</button>
            ) : (
              <button className="underline" onClick={() => setMode("sign-in")}>Have an account? Sign in</button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Login;
