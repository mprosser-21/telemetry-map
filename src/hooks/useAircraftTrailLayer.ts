import { TripsLayer } from 'deck.gl'
import { useMemo } from 'react'
import type {
  AircraftMap,
  AircraftTrip,
  AircraftHighlightGroup,
} from '../types/aerial'
import { normalizeAltitude } from '../utils/aerialUtils'
import { getAircraftTrailColor } from '../utils/colorUtils'

// Trails for the last 5 segmenets of each aircraft
export default function useAircraftTrailLayer(
  aircraftMap: AircraftMap,
  selectedAircraftHex: string,
  highlightGroups: AircraftHighlightGroup[],
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
        getAircraftTrailColor(
          aircraftMap[trip.hex],
          highlightGroups,
          selectedAircraftHex,
          trip.hex,
        ),
      updateTriggers: {
        getColor: [selectedAircraftHex, highlightGroups, aircraftMap],
      },
      widthMinPixels: 2,
      currentTime,
      opacity: 0.8,
      fadeTrail: true,
      trailLength: 5,
      capRounded: true,
      jointRounded: true,
    })
  }, [recentPaths, selectedAircraftHex, highlightGroups, aircraftMap])

  return tripsLayer
}
