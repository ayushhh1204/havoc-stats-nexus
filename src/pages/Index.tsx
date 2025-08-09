import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { getMatches, getSchedule, getToday } from "@/lib/local";
import { PlayerRoster } from "@/components/PlayerRoster";

const Index = () => {
  const today = getToday();
  const scheduled = getSchedule(today) ?? 0;
  const todayMatches = getMatches().filter((m) => m.date === today);
  const done = todayMatches.filter((m) => m.screenshot).length;

  return (
    <main>
      <SEO title="Performance Track Dashboard" description="Professional BGMI esports performance tracking with advanced analytics and player management." />
      <section className="relative overflow-hidden border-b bg-background">
        <div className="pointer-events-none absolute inset-0 bg-premium-gradient opacity-30 blur-3xl" />
        <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center gap-8 py-20 text-center">
          <div className="space-y-6">
            <h1 className="text-balance text-6xl font-bold leading-tight md:text-7xl lg:text-8xl">
              <span className="text-premium-gradient">Performance Track</span>
            </h1>
            <p className="max-w-3xl text-balance text-xl text-muted-foreground leading-relaxed">
              Professional BGMI esports performance tracking with advanced match analytics, 
              detailed player statistics, and comprehensive team management tools.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="hero" size="lg" className="shadow-premium hover:shadow-glow spring-transition text-lg px-10 py-6">
              <Link to="/matches">Set Today's Matches</Link>
            </Button>
            <Button asChild variant="premium" size="lg" className="spring-transition text-lg px-10 py-6">
              <Link to="/stats">View Analytics</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Player Roster Section */}
      <section className="container mx-auto py-12">
        <PlayerRoster />
      </section>

      {/* Statistics Cards */}
      <section className="container mx-auto grid gap-6 py-10 md:grid-cols-3">
        <Card className="glass-effect shadow-elevated hover:shadow-glow smooth-transition border-primary/20">
          <CardHeader className="space-y-2">
            <CardTitle className="text-primary">Today's Schedule</CardTitle>
            <CardDescription className="text-base">{today}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{scheduled}</div>
            <p className="text-sm text-muted-foreground mt-2">matches scheduled</p>
          </CardContent>
        </Card>
        <Card className="glass-effect shadow-elevated hover:shadow-glow smooth-transition border-primary/20">
          <CardHeader className="space-y-2">
            <CardTitle className="text-primary">Completed Uploads</CardTitle>
            <CardDescription className="text-base">Uploaded screenshots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{done}</div>
            <p className="text-sm text-muted-foreground mt-2">screenshots uploaded</p>
          </CardContent>
        </Card>
        <Card className="glass-effect shadow-elevated hover:shadow-glow smooth-transition border-primary/20">
          <CardHeader className="space-y-2">
            <CardTitle className="text-primary">Pending</CardTitle>
            <CardDescription className="text-base">Remaining uploads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{Math.max(0, (scheduled || 0) - done)}</div>
            <p className="text-sm text-muted-foreground mt-2">matches remaining</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Index;