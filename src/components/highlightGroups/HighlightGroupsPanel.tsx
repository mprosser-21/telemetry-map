import type { AircraftHighlightGroup } from "@/types/aerial";
import { PlusIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { CATEGORY_OPTIONS } from "./CategoryPicker";
import HighlightGroup from "./HighlightGroup";
import { ALTITUDE_LIMITS, SPEED_LIMITS } from "./HighlightGroup";

function createHighlightGroup(): AircraftHighlightGroup {
  return {
    id: uuidv4(),
    name: "Unnamed Group",
    color: "emerald",
    categories: [...CATEGORY_OPTIONS],
    altitudeRange: [...ALTITUDE_LIMITS],
    speedRange: [...SPEED_LIMITS],
  };
}

export default function HighlightGroupsPanel({
  groups,
  setGroups,
}: {
  groups: AircraftHighlightGroup[];
  setGroups: Dispatch<SetStateAction<AircraftHighlightGroup[]>>;
}) {
  return (
    <div className="text-card-foreground">
      <div className="flex items-center justify-between px-4 pt-4">
        <div>
          <div className="text-lg font-semibold">Highlight Groups</div>
          <div className="text-sm text-muted-foreground">
            Match and highlight aircraft on the map
          </div>
        </div>
      </div>

      <Separator className="mt-2" />

      <div className="max-h-[28rem] space-y-4 overflow-y-auto p-4">
        {groups.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
            No active groups. Add a group below to start highlighting matches.
          </div>
        ) : null}

        {groups.map((group) => (
          <HighlightGroup key={group.id} group={group} setGroups={setGroups} />
        ))}
        <div className="flex">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              setGroups((currentGroups) => [
                ...currentGroups,
                createHighlightGroup(),
              ]);
            }}
          >
            <PlusIcon />
            Add Group
          </Button>
        </div>
      </div>
    </div>
  );
}
