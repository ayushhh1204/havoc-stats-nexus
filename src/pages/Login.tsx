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
  // Sign up disabled by admin; login only
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signIn } = useAuth();

  useEffect(() => {
    if (user) {
      toast({ title: "Welcome back!", description: "You're now logged in." });
      navigate("/");
    }
  }, [user, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Login only
    const { error } = await signIn(email.trim(), password);
    if (error) {
      toast({ title: "Login failed", description: error, variant: "destructive" });
    } else {
      toast({ title: "Logged in", description: "Redirecting..." });
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <main className="container mx-auto py-10">
      <SEO title="Login" description="Player login to upload match results and stats." />
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Player Login</CardTitle>
          <CardDescription>
            Use your team email and password. Sign-ups are disabled; contact the admin to be added.
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
              <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Sign-ups are disabled. If you need access, contact the admin to register your email.
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Login;
