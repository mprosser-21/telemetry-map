import type { AircraftMap } from '../types/aerial'
import useSelectedLayer from './useSelectedLayer'
import useAircraftTrailLayer from './useAircraftTrailLayer'
import useAerialIconLayers from './useAerialIconLayers'

export default function useAerialLayers(
  aircraftMap: AircraftMap,
  selectedAircraftHex: string,
  setSelectedAircraftHex: (hex: string) => void,
) {
  const selectedTripLayer = useSelectedLayer(aircraftMap[selectedAircraftHex])

  const aircraftTrailLayer = useAircraftTrailLayer(
    aircraftMap,
    selectedAircraftHex,
  )

  const [hoverLayer, iconLayer] = useAerialIconLayers(
    aircraftMap,
    selectedAircraftHex,
    setSelectedAircraftHex,
  )

  return [selectedTripLayer, hoverLayer, iconLayer, aircraftTrailLayer]
}
