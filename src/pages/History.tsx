import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMatches } from "@/lib/local";
import { Link } from "react-router-dom";

const History = () => {
  const all = getMatches().sort((a, b) => (a.id > b.id ? -1 : 1));

  return (
    <main className="container mx-auto py-10">
      <SEO title="Match History" description="Browse uploaded screenshots and stats by match." />
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {all.map((m) => (
          <Link to={`/matches/${m.id}`} key={m.id} className="smooth-transition hover:-translate-y-0.5">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{m.label}</CardTitle>
                <CardDescription>{m.date}</CardDescription>
              </CardHeader>
              <CardContent>
                {m.screenshot ? (
                  <img src={m.screenshot} alt={`${m.label} screenshot`} className="aspect-video w-full rounded-md border object-cover" loading="lazy" />
                ) : (
                  <div className="aspect-video w-full rounded-md border text-center text-sm text-muted-foreground grid place-items-center">
                    No screenshot
                  </div>
                )}
                <div className="mt-3 grid grid-cols-3 text-center text-xs">
                  <div>
                    <div className="text-muted-foreground">Kills</div>
                    <div className="font-semibold">{m.teamKills ?? 0}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Position</div>
                    <div className="font-semibold">{m.teamPosition ?? 0}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Players</div>
                    <div className="font-semibold">5</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default History;
