import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PLAYERS, PlayerName } from "@/components/PlayerAvatars";
import { getMatches, upsertMatch } from "@/lib/local";
import type { MatchEntry } from "@/types/match";

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<MatchEntry | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [teamKills, setTeamKills] = useState<number>(0);
  const [teamPosition, setTeamPosition] = useState<number>(0);
  const [playerKills, setPlayerKills] = useState<Record<PlayerName, number>>({
    Black: 0,
    Arcues: 0,
    DulBhai: 0,
    Noxious: 0,
    Zexu: 0,
  });

  useEffect(() => {
    if (!id) return;
    const found = getMatches().find((m) => m.id === id) || null;
    if (found) {
      setEntry(found);
      setPreview(found.screenshot);
      setTeamKills(found.teamKills ?? 0);
      setTeamPosition(found.teamPosition ?? 0);
      const pk: Record<PlayerName, number> = { Black: 0, Arcues: 0, DulBhai: 0, Noxious: 0, Zexu: 0 };
      PLAYERS.forEach((p) => (pk[p] = Number(found.playerKills?.[p] ?? 0)));
      setPlayerKills(pk);
    }
  }, [id]);

  const label = useMemo(() => entry?.label ?? id?.split("-").slice(-1)[0] ?? "Match", [entry, id]);

  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const onSave = () => {
    if (!entry) return;
    const payload: MatchEntry = {
      ...entry,
      screenshot: preview,
      teamKills: Number(teamKills) || 0,
      teamPosition: Number(teamPosition) || 0,
      playerKills: playerKills,
    };
    upsertMatch(payload);
    alert("Saved! You can review it in History and Stats.");
  };

  if (!entry) {
    return (
      <main className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Match not found</CardTitle>
            <CardDescription>
              This match does not exist. Go back to <Link to="/matches" className="underline">Matches</Link>.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-10">
      <SEO title={`Upload ${label}`} description={`Upload result screenshot and stats for ${label}.`} />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{label} — Upload Screenshot</CardTitle>
            <CardDescription>Date: {entry.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onFile(e.target.files?.[0])}
                className="rounded-md border bg-background p-3"
              />
              {preview ? (
                <img src={preview} alt={`${label} result screenshot`} className="w-full rounded-lg border" loading="lazy" />
              ) : (
                <div className="flex h-48 items-center justify-center rounded-lg border text-sm text-muted-foreground">
                  No screenshot uploaded yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enter Stats</CardTitle>
            <CardDescription>Team and individual performance for this match.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="teamKills">Team Kills</Label>
                  <Input id="teamKills" type="number" min={0} value={teamKills}
                    onChange={(e) => setTeamKills(Number(e.target.value))} />
                </div>
                <div>
                  <Label htmlFor="teamPosition">Team Position</Label>
                  <Input id="teamPosition" type="number" min={1} max={20} value={teamPosition}
                    onChange={(e) => setTeamPosition(Number(e.target.value))} />
                </div>
              </div>

              <div className="grid gap-3">
                <Label>Individual Kills</Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {PLAYERS.map((p) => (
                    <div key={p} className="rounded-md border p-3">
                      <div className="text-sm font-medium">{p}</div>
                      <Input
                        type="number"
                        min={0}
                        value={playerKills[p]}
                        onChange={(e) =>
                          setPlayerKills((prev) => ({ ...prev, [p]: Number(e.target.value) }))
                        }
                        className="mt-2"
                        aria-label={`${p} kills`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="hero" onClick={onSave}>Save</Button>
                <Button asChild variant="outline">
                  <Link to="/history">Go to History</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default MatchDetail;
