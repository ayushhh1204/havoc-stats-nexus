import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { getMatches, getSchedule, getToday } from "@/lib/local";

const Index = () => {
  const today = getToday();
  const scheduled = getSchedule(today) ?? 0;
  const todayMatches = getMatches().filter((m) => m.date === today);
  const done = todayMatches.filter((m) => m.screenshot).length;

  return (
    <main>
      <SEO title="HAVOC BGMI Esports Tracker" description="Organize match screenshots, enter player kills, and visualize HAVOC performance." />
      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 bg-hero-gradient opacity-20 blur-3xl" />
        <div className="container mx-auto flex min-h-[64vh] flex-col items-center justify-center gap-6 py-16 text-center">
          <h1 className="text-balance text-5xl font-bold leading-tight md:text-6xl">
            Track HAVOC performance beautifully
          </h1>
          <p className="max-w-2xl text-balance text-lg text-muted-foreground">
            Set daily matches (M1, M2, …), collect result screenshots, and record team & individual stats. Review everything in History and Stats.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/matches">Set Today’s Matches</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/stats">View Stats</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-6 py-10 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Today’s Schedule</CardTitle>
            <CardDescription>{today}</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{scheduled}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Uploads</CardTitle>
            <CardDescription>Uploaded screenshots</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{done}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
            <CardDescription>Remaining uploads</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{Math.max(0, (scheduled || 0) - done)}</CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Index;
