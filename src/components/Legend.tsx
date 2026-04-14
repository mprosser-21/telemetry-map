import type { AircraftHighlightGroup } from "@/types/aerial";
import { HIGHLIGHT_GROUP_COLORS, toRgbString } from "@/utils/colorUtils";
import { CircleXIcon, DiamondIcon, SendHorizontalIcon } from "lucide-react";

export default function Legend({
  groups,
}: {
  groups: AircraftHighlightGroup[];
}) {
  return (
    <div className="absolute right-6 bottom-6 z-50 flex w-56 flex-col gap-3 rounded-lg border border-white/12 bg-card/78 p-4 shadow-lg backdrop-blur-sm">
      <div className="text-md font-semibold text-card-foreground">Legend</div>

      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground uppercase">
          Aircraft
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <SendHorizontalIcon
              className="size-4 text-card-foreground"
              fill="currentColor"
            />
            <span className="text-sm text-card-foreground">Fixed Wing</span>
          </div>

          <div className="flex items-center gap-2">
            <CircleXIcon className="size-4 text-card-foreground" />
            <span className="text-sm text-card-foreground">Rotorcraft</span>
          </div>

          <div className="flex items-center gap-2">
            <DiamondIcon className="size-4 text-card-foreground" />
            <span className="text-sm text-card-foreground">Other</span>
          </div>
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase">
            Groups
          </div>

          <div className="space-y-2">
            {groups.map((group) => {
              const color = HIGHLIGHT_GROUP_COLORS[group.color];

              return (
                <div key={group.id} className="flex items-center gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-sm border border-white/15"
                      style={{
                        backgroundColor: toRgbString(color.rgb),
                      }}
                    />
                    <span className="truncate text-sm text-card-foreground">
                      {group.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
