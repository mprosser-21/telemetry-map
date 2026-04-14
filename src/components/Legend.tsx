import type { AircraftHighlightGroup } from '@/types/aerial'
import { HIGHLIGHT_GROUP_COLORS, toRgbString } from '@/utils/colorUtils'

export default function Legend({
  groups,
}: {
  groups: AircraftHighlightGroup[]
}) {
  if (groups.length === 0) {
    return null
  }

  return (
    <div className="absolute bottom-6 left-6 z-50 w-48 rounded-lg border border-border bg-card shadow-lg p-4 flex flex-col gap-2">
      <div className="text-md font-semibold text-card-foreground">Legend</div>

      <div className="space-y-2">
        {groups.map((group) => {
          const color = HIGHLIGHT_GROUP_COLORS[group.color]

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
          )
        })}
      </div>
    </div>
  )
}
