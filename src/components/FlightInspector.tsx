import type { Aircraft } from '../types/aerial'
import { aircraftTypeDesignators } from '../../data/aircraftTypeDesignators'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export default function FlightInspector({
  aircraft,
  open,
}: {
  aircraft?: Aircraft
  open: boolean
}) {
  const [displayAircraft, setDisplayAircraft] = useState<Aircraft | undefined>(
    aircraft,
  )

  // When selected changes, update the displayed aircraft
  // When closed, wait before hiding to ensure smooth animation/transition
  useEffect(() => {
    if (aircraft) {
      setDisplayAircraft(aircraft)
      return
    }

    if (!open) {
      const timeout = window.setTimeout(() => {
        setDisplayAircraft(undefined)
      }, 200)

      return () => window.clearTimeout(timeout)
    }
  }, [aircraft, open])

  const { flight, direction, altitude, speed, designator } =
    displayAircraft ?? {}
  const aircraftType =
    designator && (aircraftTypeDesignators[designator] ?? designator)

  return (
    <div
      className={cn(
        'absolute top-12 right-6 w-60 rounded-lg border border-border bg-background shadow-lg transition-all duration-200',
        open
          ? 'pointer-events-auto translate-x-0 scale-100 opacity-100'
          : 'pointer-events-none translate-x-2 scale-95 opacity-0',
      )}
    >
      {displayAircraft ? (
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
                  : `${altitude} ft`
                : 'Unknown'}
            </div>
            <div className="lowercase text-muted-foreground">Speed</div>
            <div>{speed != null ? `${speed} kts` : 'Unknown'}</div>
          </div>
        </>
      ) : (
        <div className="p-4 text-sm text-muted-foreground">
          Please select a flight to view details
        </div>
      )}
    </div>
  )
}
