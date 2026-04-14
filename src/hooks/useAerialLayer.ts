import { IconLayer, ScatterplotLayer, TripsLayer } from 'deck.gl'
import { useMemo, useState } from 'react'
import type { Aircraft, AircraftMap } from '../types/aerial'
import {
  AERIAL_ICON_MAPPING,
  getAerialIcon,
  normalizeAltitude,
} from '../utils/aerialUtils'

type AircraftTrip = {
  hex: string
  path: [number, number, number][]
  timestamps: number[]
}

export default function useAerialLayers(
  aircraftMap: AircraftMap,
  setSelectedAircraftHex: (hex: string) => void,
) {
  const [hoveredAircraftHex, setHoveredAircraftHex] = useState('')

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
      getColor: () => [56, 189, 248],
      widthMinPixels: 2,
      currentTime,
      opacity: 0.8,
      fadeTrail: true,
      trailLength: 5,
      capRounded: true,
      jointRounded: true,
    })
  }, [recentPaths])

  const hoveredAircraft = useMemo(() => {
    return hoveredAircraftHex ? aircraftMap[hoveredAircraftHex] : undefined
  }, [aircraftMap, hoveredAircraftHex])

  const hoverLayer = useMemo(() => {
    const data = hoveredAircraft ? [hoveredAircraft] : []

    return new ScatterplotLayer<Aircraft>({
      id: 'aerial-hover-halo',
      data,
      getPosition: (aircraft) => [
        aircraft.lon ?? 0,
        aircraft.lat ?? 0,
        normalizeAltitude(aircraft.altitude),
      ],
      getRadius: 1200,
      radiusUnits: 'meters',
      radiusMinPixels: 10,
      radiusMaxPixels: 22,
      stroked: true,
      filled: true,
      getLineColor: [125, 211, 252, 220],
      getFillColor: [56, 189, 248, 30],
      lineWidthMinPixels: 1,
      billboard: false,
      pickable: false,
    })
  }, [hoveredAircraft])

  const iconLayer = useMemo(() => {
    const aircraftLocations = Object.values(aircraftMap)

    return new IconLayer<Aircraft>({
      id: 'aerial-icons',
      data: aircraftLocations,
      iconAtlas: '/aerial-icon-atlas.svg',
      iconMapping: AERIAL_ICON_MAPPING,
      onHover: (info) => {
        setHoveredAircraftHex(info.object?.hex ?? '')
      },
      onClick: (info) => {
        if (info.object) {
          setSelectedAircraftHex(info.object.hex)
        }
      },
      getPosition: (aircraft) => [
        aircraft.lon ?? 0,
        aircraft.lat ?? 0,
        normalizeAltitude(aircraft.altitude),
      ],
      getAngle: (aircraft) => -(aircraft.direction ?? 0),
      getIcon: (aircraft) => getAerialIcon(aircraft.category),
      getColor: (aircraft) =>
        aircraft.altitude === 'ground' ? [163, 163, 163] : [56, 189, 248],
      getSize: 16,
      sizeUnits: 'pixels',
      sizeScale: 1,
      pickable: true,
      billboard: false,
    })
  }, [aircraftMap, setSelectedAircraftHex])

  return [tripsLayer, hoverLayer, iconLayer]
}
