import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  return (
    <main className="container mx-auto py-10">
      <SEO title="Login" description="Player login to upload match results and stats." />
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Player Login</CardTitle>
          <CardDescription>
            Connect Supabase to enable secure authentication for players Black, Arcues, DulBhai, Noxious, and Zexu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Authentication and file storage require enabling the Supabase integration in Lovable (top-right green button).
            </p>
            <p>
              Once enabled, we’ll add email/password login for each player and restrict access per account.
            </p>
          </div>
          <div className="mt-4">
            <Button variant="hero" disabled className="w-full">Login (Connect Supabase first)</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Login;
