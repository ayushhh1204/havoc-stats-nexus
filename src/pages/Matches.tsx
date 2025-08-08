import { useEffect, useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { buildMatchId, getMatches, getSchedule, getToday, saveSchedule, saveMatches } from "@/lib/local";
import { MatchEntry } from "@/types/match";
import { ImagePlus, CheckCircle2, Clock } from "lucide-react";

function generateDayMatches(date: string, count: number): MatchEntry[] {
  const list: MatchEntry[] = [];
  for (let i = 1; i <= count; i++) {
    list.push({ id: buildMatchId(date, i), label: `M${i}`, date });
  }
  return list;
}

const Matches = () => {
  const today = getToday();
  const [count, setCount] = useState<number>(getSchedule(today) ?? 0);
  const [matches, setMatches] = useState<MatchEntry[]>([]);

  useEffect(() => {
    const all = getMatches();
    const todays = all.filter((m) => m.date === today);
    setMatches(todays);
  }, [today]);

  const completed = useMemo(() => matches.filter((m) => m.screenshot).length, [matches]);

  const onSet = () => {
    const n = Math.max(0, Math.min(16, Number(count) || 0));
    saveSchedule(today, n);
    const existing = getMatches().filter((m) => m.date !== today);
    const todays = generateDayMatches(today, n);
    saveMatches([...existing, ...todays]);
    setMatches(todays);
  };

  return (
    <main className="container mx-auto py-10">
      <SEO title="Set HAVOC Matches" description="Create today's BGMI match slots and manage uploads." />
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Today's Matches</CardTitle>
            <CardDescription>Choose how many matches the team will play today.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Input
              type="number"
              min={0}
              max={16}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="max-w-[140px]"
              aria-label="Number of matches"
            />
            <Button variant="hero" onClick={onSet}>Set Matches</Button>
            <div className="ml-auto text-sm text-muted-foreground">
              {completed}/{matches.length} uploaded
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {matches.map((m) => {
          const isDone = !!m.screenshot;
          return (
            <Link key={m.id} to={`/matches/${m.id}`} className="smooth-transition hover:-translate-y-0.5">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{m.label}</CardTitle>
                  <CardDescription>{m.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-sm">
                  {isDone ? (
                    <>
                      <CheckCircle2 className="text-primary" />
                      <span>Uploaded</span>
                    </>
                  ) : (
                    <>
                      <Clock className="text-muted-foreground" />
                      <span>Pending</span>
                    </>
                  )}
                  <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                    <ImagePlus className="opacity-70" /> Upload
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>
    </main>
  );
};

export default Matches;
