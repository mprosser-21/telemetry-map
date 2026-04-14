import { ScatterplotLayer, IconLayer } from 'deck.gl'
import { useMemo, useState } from 'react'
import type { AircraftMap, Aircraft } from '../types/aerial'
import {
  getAircraftPosition,
  AERIAL_ICON_MAPPING,
  getAerialIcon,
} from '../utils/aerialUtils'

// Layer for icons at aircraft locations and a layer to add hover halo effect
export default function useAerialIconLayers(
  aircraftMap: AircraftMap,
  selectedAircraftHex: string,
  setSelectedAircraftHex: (hex: string) => void,
) {
  const [hoveredAircraftHex, setHoveredAircraftHex] = useState('')

  const hoverLayer = useMemo(() => {
    const hoveredAircraft = aircraftMap[hoveredAircraftHex]
    const data = hoveredAircraft ? [hoveredAircraft] : []

    return new ScatterplotLayer<Aircraft>({
      id: 'aerial-hover-halo',
      data,
      getPosition: (aircraft) => getAircraftPosition(aircraft),
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
  }, [aircraftMap, hoveredAircraftHex])

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
      getPosition: (aircraft) => getAircraftPosition(aircraft),
      getAngle: (aircraft) => -(aircraft.direction ?? 0),
      getIcon: (aircraft) => getAerialIcon(aircraft.category),
      getColor: (aircraft) =>
        aircraft.altitude === 'ground'
          ? selectedAircraftHex && aircraft.hex !== selectedAircraftHex
            ? [163, 163, 163, 90]
            : [163, 163, 163, 255]
          : selectedAircraftHex && aircraft.hex !== selectedAircraftHex
            ? [56, 189, 248, 90]
            : [56, 189, 248, 255],
      updateTriggers: {
        getColor: [selectedAircraftHex],
      },
      getSize: 16,
      sizeUnits: 'pixels',
      sizeScale: 1,
      pickable: true,
      billboard: false,
    })
  }, [aircraftMap, selectedAircraftHex, setSelectedAircraftHex])

  return [hoverLayer, iconLayer]
}
