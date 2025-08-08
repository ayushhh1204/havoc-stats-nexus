import { cn } from "@/lib/utils";

export const PLAYERS = ["Black", "Arcues", "DulBhai", "Noxious", "Zexu"] as const;
export type PlayerName = typeof PLAYERS[number];

interface PlayerAvatarsProps {
  selected?: PlayerName[];
  onToggle?: (name: PlayerName) => void;
  kills?: Record<PlayerName, number>;
  editableKills?: boolean;
}

const colorMap: Record<PlayerName, string> = {
  Black: "bg-primary/20 text-primary",
  Arcues: "bg-secondary text-secondary-foreground",
  DulBhai: "bg-accent text-accent-foreground",
  Noxious: "bg-muted text-muted-foreground",
  Zexu: "bg-primary/10 text-primary",
};

export const PlayerAvatars = ({ selected = [], onToggle, kills, editableKills }: PlayerAvatarsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {PLAYERS.map((name) => {
        const isActive = selected.includes(name);
        const killVal = kills?.[name] ?? 0;
        return (
          <div
            key={name}
            className={cn(
              "rounded-lg border p-3 smooth-transition",
              isActive ? "border-primary shadow-elevated" : "hover:border-primary/40"
            )}
          >
            <button
              type="button"
              onClick={() => onToggle?.(name)}
              className={cn(
                "mx-auto flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold",
                colorMap[name]
              )}
              aria-pressed={isActive}
            >
              {name.charAt(0)}
            </button>
            <div className="mt-2 text-center text-sm font-medium">{name}</div>
            {editableKills ? (
              <div className="mt-2 flex items-center justify-center gap-2">
                <label htmlFor={`kills-${name}`} className="text-xs text-muted-foreground">
                  Kills
                </label>
                <input
                  id={`kills-${name}`}
                  type="number"
                  min={0}
                  className="h-8 w-16 rounded-md border bg-background px-2 text-center text-sm"
                  defaultValue={killVal}
                  onChange={(e) => onToggle?.(name)}
                />
              </div>
            ) : (
              <div className="mt-1 text-center text-xs text-muted-foreground">
                {killVal} kills
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
