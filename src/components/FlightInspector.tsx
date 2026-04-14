import type { Aircraft } from '../types/aerial'
import { aircraftTypeDesignators } from '../../data/aircraftTypeDesignators'

export default function FlightInspector({
  aircraft,
}: {
  aircraft?: Aircraft
}) {
  const { flight, direction, altitude, speed, designator } = aircraft ?? {}
  const aircraftType =
    designator && (aircraftTypeDesignators[designator] ?? designator)

  return (
    <div>
      {aircraft ? (
        <>
          <div className="border-b border-border pt-4 px-4 pb-2">
            <div className="text-lg font-semibold text-foreground">
              {flight ?? 'Unknown Flight'}
            </div>
            {aircraftType && (
              <div
                className="text-sm text-muted-foreground truncate"
                title={aircraftType}
              >
                {aircraftType}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 px-4 pb-4 text-sm">
            <div className="lowercase text-muted-foreground">Direction</div>
            <div>{direction != null ? `${direction}°` : 'N/A'}</div>
            <div className="lowercase text-muted-foreground">Altitude</div>
            <div>
              {altitude
                ? altitude === 'ground'
                  ? 'Ground'
                  : `${altitude.toLocaleString()} ft`
                : 'Unknown'}
            </div>
            <div className="lowercase text-muted-foreground">Speed</div>
            <div>{speed != null ? `${speed} kts` : 'Unknown'}</div>
          </div>
        </>
      ) : (
        <div className="p-4">
          <div className="text-lg font-semibold">No Flight Selected</div>
          <div className="text-sm text-muted-foreground">
            Please select a flight to view details
          </div>
        </div>
      )}
    </div>
  )
}
