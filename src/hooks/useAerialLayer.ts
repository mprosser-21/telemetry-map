import { IconLayer, TripsLayer } from 'deck.gl'
import { useMemo } from 'react'
import type { AircraftMap } from '../types/aerial'
import { AERIAL_ICON_MAPPING, getAerialIcon } from '../utils/aerialUtils'

type AircraftTrip = {
  hex: string
  path: [number, number][]
  timestamps: number[]
}

export default function useAerialLayers(aircraftMap: AircraftMap) {
  // Trails for the last 5 segmenets of each aircraft
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
            path: visibleHistory.map((point) => [point.lon, point.lat]),
            timestamps: visibleHistory.map((_, index) => index),
          },
        ]
      })
  }, [aircraftMap])

  const pathLayer = useMemo(() => {
    const currentTime = Math.max(
      0,
      ...recentPaths.flatMap((path) => path.timestamps),
    )

    return new TripsLayer<AircraftTrip>({
      id: 'aerial-paths',
      data: recentPaths,
      getPath: (trip) => trip.path,
      getTimestamps: (trip) => trip.timestamps,
      getColor: () => [56, 189, 248],
      getWidth: 2,
      widthMinPixels: 2,
      currentTime,
      opacity: 0.8,
      fadeTrail: true,
      trailLength: 5,
      capRounded: true,
      jointRounded: true,
    })
  }, [recentPaths])

  const iconLayer = useMemo(() => {
    const aircraftLocations = Object.values(aircraftMap)

    return new IconLayer({
      id: 'aerial-icons',
      data: aircraftLocations,
      iconAtlas: '/aerial-icon-atlas.svg',
      iconMapping: AERIAL_ICON_MAPPING,
      getPosition: (aircraft) => [aircraft.lon, aircraft.lat],
      getAngle: (aircraft) => -(aircraft.track ?? 0),
      getIcon: (aircraft) => getAerialIcon(aircraft.category),
      getColor: (aircraft) =>
        aircraft.altitude === 'ground' ? [163, 163, 163] : [56, 189, 248],
      getSize: 16,
      sizeUnits: 'pixels',
      sizeScale: 1,
      pickable: true,
    })
  }, [aircraftMap])

  return [pathLayer, iconLayer]
}
