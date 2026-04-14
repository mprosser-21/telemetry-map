import type { AircraftHighlightGroup } from "@/types/aerial";
import type { Dispatch, SetStateAction } from "react";
import CategoryPicker from "./CategoryPicker";
import ColorPicker from "./ColorPicker";
import GroupHeader from "./GroupHeader";
import RangePicker from "./RangePicker";

export const ALTITUDE_LIMITS: [number, number] = [0, 45000];
export const SPEED_LIMITS: [number, number] = [0, 600];

export default function HighlightGroup({
  group,
  setGroups,
}: {
  group: AircraftHighlightGroup;
  setGroups: Dispatch<SetStateAction<AircraftHighlightGroup[]>>;
}) {
  function setGroupField<K extends keyof AircraftHighlightGroup>(
    key: K,
    value: AircraftHighlightGroup[K],
  ) {
    setGroups((currentGroups) =>
      currentGroups.map((currentGroup) =>
        currentGroup.id === group.id
          ? {
              ...currentGroup,
              [key]: value,
            }
          : currentGroup,
      ),
    );
  }

  return (
    <div key={group.id} className="rounded-lg border border-border p-3">
      <GroupHeader
        name={group.name}
        onNameChange={(newName) => {
          setGroupField("name", newName);
        }}
        onRemove={() => {
          setGroups((currentGroups) =>
            currentGroups.filter(
              (currentGroup) => currentGroup.id !== group.id,
            ),
          );
        }}
      />

      <div className="flex flex-col gap-4">
        <div>
          <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">
            Color
          </div>
          <ColorPicker
            currentColor={group.color}
            onChange={(newColor) => {
              setGroupField("color", newColor);
            }}
          />
        </div>
        <div>
          <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">
            Type
          </div>
          <CategoryPicker
            currentCategories={group.categories}
            onChange={(newCategories) => {
              setGroupField("categories", newCategories);
            }}
          />
        </div>
        <RangePicker
          label="Altitude"
          range={group.altitudeRange}
          min={ALTITUDE_LIMITS[0]}
          max={ALTITUDE_LIMITS[1]}
          step={500}
          unit="ft"
          onValueChange={(newAltitudeRange) => {
            setGroupField("altitudeRange", newAltitudeRange);
          }}
        />
        <RangePicker
          label="Speed"
          range={group.speedRange}
          min={SPEED_LIMITS[0]}
          max={SPEED_LIMITS[1]}
          step={10}
          unit="kts"
          onValueChange={(newSpeedRange) => {
            setGroupField("speedRange", newSpeedRange);
          }}
        />
      </div>
    </div>
  );
}
