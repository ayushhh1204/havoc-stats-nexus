import SEO from "@/components/SEO";
import { getMatches, getToday } from "@/lib/local";
import { PLAYERS, PlayerName } from "@/components/PlayerAvatars";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const Stats = () => {
  const today = getToday();
  const todays = getMatches().filter((m) => m.date === today);

  const teamData = todays.map((m) => ({
    name: m.label,
    kills: m.teamKills ?? 0,
    position: m.teamPosition ?? 0,
  }));

  const playerData: Record<PlayerName, { name: string; kills: number }[]> = {
    Black: [], Arcues: [], DulBhai: [], Noxious: [], Zexu: [],
  };
  todays.forEach((m) => {
    PLAYERS.forEach((p) => {
      playerData[p].push({ name: m.label, kills: Number(m.playerKills?.[p] ?? 0) });
    });
  });

  return (
    <main className="container mx-auto py-10">
      <SEO title="Performance Stats" description="Team positions and kills per match, plus player kill trends." />

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-semibold">Team Kills (Today)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={teamData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="kills" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-semibold">Team Position (Today)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={teamData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis reversed />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="position" stroke="hsl(var(--accent-foreground))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Players — Kills per Match (Today)</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLAYERS.map((p) => (
            <div key={p} className="rounded-lg border p-4">
              <h3 className="mb-2 text-sm font-medium">{p}</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={playerData[p]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="kills" stroke="hsl(var(--ring))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Stats;
