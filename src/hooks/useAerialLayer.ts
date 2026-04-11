import useSWR from 'swr'
import { IconLayer, LineLayer } from 'deck.gl'
import { useEffect, useMemo, useState } from 'react'
import type { AircraftMap } from '../types/aerial'
import {
  processAerialUpdate,
  fetcher,
  pruneStaleAircraft,
  AERIAL_ICON_MAPPING,
  getAerialIcon,
} from '../utils/aerialUtils'

export function useAerialData() {
  const [aircraftMap, setAircraftMap] = useState<AircraftMap>({})

  // TODO: Error handling with retry / backoff
  const { data } = useSWR('/api/adsb/v2/point/41.8240/-71.4128/50', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 1000,
  })

  useEffect(() => {
    if (data) {
      setAircraftMap((prev) => {
        const newAircraftMap = processAerialUpdate(prev, data)

        return pruneStaleAircraft(newAircraftMap, data.now)
      })
    }
  }, [data])

  const lineSegments = useMemo(() => {
    return Object.values(aircraftMap).flatMap((aircraft) => {
      const { hex, history } = aircraft
      return aircraft.history.flatMap((point, index) => {
        const previousPoint = history[index - 1]

        if (!previousPoint) {
          return []
        }

        return [
          {
            hex,
            from: previousPoint,
            to: point,
          },
        ]
      })
    })
  }, [aircraftMap])

  const lineLayer = useMemo(() => {
    return new LineLayer({
      id: 'aerial-paths',
      data: lineSegments,
      getColor: () => [56, 189, 248],
      getSourcePosition: (segment) => [segment.from.lon, segment.from.lat],
      getTargetPosition: (segment) => [segment.to.lon, segment.to.lat],
      getWidth: 2,
      pickable: true,
    })
  }, [lineSegments])

  const iconLayer = useMemo(() => {
    const aircraftLocations = Object.values(aircraftMap)

    return new IconLayer({
      id: 'aerial-icons',
      data: aircraftLocations,
      iconAtlas: '/aerial-icon-atlas.svg',
      iconMapping: AERIAL_ICON_MAPPING,
      getPosition: (aircraft) => [aircraft.lon, aircraft.lat],
      getIcon: (aircraft) => getAerialIcon(aircraft.category),
      getColor: () => [56, 189, 248],
      getSize: 22,
      sizeUnits: 'pixels',
      sizeScale: 1,
      pickable: true,
    })
  }, [aircraftMap])

  return [lineLayer, iconLayer]
}
