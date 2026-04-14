import { TripsLayer } from 'deck.gl'
import { useMemo } from 'react'
import type { AircraftMap, AircraftTrip } from '../types/aerial'
import { normalizeAltitude } from '../utils/aerialUtils'

// Trails for the last 5 segmenets of each aircraft
export default function useAircraftTrailLayer(
  aircraftMap: AircraftMap,
  selectedAircraftHex: string,
) {
  const recentPaths = useMemo<AircraftTrip[]>(() => {
    return Object.values(aircraftMap)
      .filter((aircraft) => aircraft.altitude !== 'ground')
      .flatMap((aircraft) => {
        const { hex, history } = aircraft
        const visibleHistory = history.slice(-6)

        if (visibleHistory.length < 2) {
          return []
        }

        return [
          {
            hex,
            path: visibleHistory.map((point) => [
              point.lon,
              point.lat,
              normalizeAltitude(point.altitude),
            ]),
            timestamps: visibleHistory.map((_, index) => index),
          },
        ]
      })
  }, [aircraftMap])

  const tripsLayer = useMemo(() => {
    const currentTime = Math.max(
      0,
      ...recentPaths.flatMap((path) => path.timestamps),
    )

    return new TripsLayer<AircraftTrip>({
      id: 'aerial-paths',
      data: recentPaths,
      getPath: (trip) => trip.path,
      getTimestamps: (trip) => trip.timestamps,
      getColor: (trip) =>
        selectedAircraftHex && trip.hex !== selectedAircraftHex
          ? [56, 189, 248, 60]
          : [56, 189, 248, 180],
      updateTriggers: {
        getColor: [selectedAircraftHex],
      },
      widthMinPixels: 2,
      currentTime,
      opacity: 0.8,
      fadeTrail: true,
      trailLength: 5,
      capRounded: true,
      jointRounded: true,
    })
  }, [recentPaths, selectedAircraftHex])

  return tripsLayer
}
