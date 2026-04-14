import { TripsLayer } from 'deck.gl'
import { useMemo } from 'react'
import type {
  Aircraft,
  AircraftHighlightGroup,
  AircraftTrip,
} from '../types/aerial'
import { normalizeAltitude } from '../utils/aerialUtils'
import { getSelectedAircraftTrailColor } from '../utils/colorUtils'

export default function useSelectedLayers(
  selectedAircraft: Aircraft | undefined,
  highlightGroups: AircraftHighlightGroup[],
) {
  const selectedTrip = useMemo<AircraftTrip | null>(() => {
    if (!selectedAircraft || selectedAircraft.altitude === 'ground') {
      return null
    }

    if (selectedAircraft.history.length < 2) {
      return null
    }

    return {
      hex: selectedAircraft.hex,
      path: selectedAircraft.history.map((point) => [
        point.lon,
        point.lat,
        normalizeAltitude(point.altitude),
      ]),
      timestamps: selectedAircraft.history.map((_, index) => index),
    }
  }, [selectedAircraft])

  const selectedTripLayer = useMemo(() => {
    const data = selectedTrip ? [selectedTrip] : []
    const currentTime = selectedTrip
      ? (selectedTrip.timestamps[selectedTrip.timestamps.length - 1] ?? 0)
      : 0
    const trailLength = selectedTrip ? selectedTrip.timestamps.length : 0

    return new TripsLayer<AircraftTrip>({
      id: 'selected-path',
      data,
      getPath: (trip) => trip.path,
      getTimestamps: (trip) => trip.timestamps,
      getColor: () =>
        getSelectedAircraftTrailColor(selectedAircraft, highlightGroups),
      widthMinPixels: 3,
      currentTime,
      opacity: 0.95,
      fadeTrail: false,
      trailLength,
      capRounded: true,
      jointRounded: true,
      pickable: false,
    })
  }, [selectedTrip, selectedAircraft, highlightGroups])

  return selectedTripLayer
}
