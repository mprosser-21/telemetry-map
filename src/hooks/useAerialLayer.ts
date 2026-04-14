import type { AircraftHighlightGroup, AircraftMap } from '../types/aerial'
import useSelectedLayer from './useSelectedLayer'
import useAircraftTrailLayer from './useAircraftTrailLayer'
import useAerialIconLayers from './useAerialIconLayers'

export default function useAerialLayers(
  aircraftMap: AircraftMap,
  selectedAircraftHex: string,
  setSelectedAircraftHex: (hex: string) => void,
  highlightGroups: AircraftHighlightGroup[],
) {
  const selectedTripLayer = useSelectedLayer(
    aircraftMap[selectedAircraftHex],
    highlightGroups,
  )

  const aircraftTrailLayer = useAircraftTrailLayer(
    aircraftMap,
    selectedAircraftHex,
    highlightGroups,
  )

  const [hoverLayer, iconLayer] = useAerialIconLayers(
    aircraftMap,
    selectedAircraftHex,
    setSelectedAircraftHex,
    highlightGroups,
  )

  return [selectedTripLayer, hoverLayer, iconLayer, aircraftTrailLayer]
}
