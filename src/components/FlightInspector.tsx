import type { Aircraft } from '../types/aerial'
import { aircraftTypeDesignators } from '../../data/aircraftTypeDesignators'

export default function FlightInspector({ aircraft }: { aircraft?: Aircraft }) {
  if (!aircraft) {
    return null
  }

  const { flight, direction, altitude, speed, designator } = aircraft
  const aircraftType = designator
    ? (aircraftTypeDesignators[designator] ?? designator)
    : null

  return (
    <div className="absolute z-50 flex flex-col min-w-64 text-white bg-neutral-700 top-4 left-4 rounded-md border border-neutral-500">
      <div className="pt-4 px-4 pb-2 border-b border-neutral-500">
        <div className="text-lg font-semibold">
          {flight ?? 'Unknown Flight'}
        </div>
        <div className="text-sm text-neutral-400">{aircraftType}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 p-4 pt-2">
        <>
          <div className="lowercase text-neutral-400">Direction</div>
          <div>{direction ? `${direction}°` : 'N/A'}</div>
        </>
        <>
          <div className="lowercase text-neutral-400">Altitude</div>
          <div>
            {altitude
              ? altitude === 'ground'
                ? 'Ground'
                : `${altitude} ft`
              : 'Unknown'}
          </div>
        </>
        <>
          <div className="lowercase text-neutral-400">Speed</div>
          <div>{speed ? `${speed} kts` : 'Unknown'}</div>
        </>
      </div>
    </div>
  )
}
