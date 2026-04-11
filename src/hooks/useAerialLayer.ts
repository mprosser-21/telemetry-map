import useSWR from 'swr'
import { LineLayer } from 'deck.gl'
import { useEffect, useMemo, useState } from 'react'
import type { AircraftLocation, Aircraft } from '../types/aerial'
import {
  processAerialUpdate,
  fetcher,
  pruneStaleAircraft,
} from '../utils/aerialUtils'

type LineSegment = {
  hex: string
  from: AircraftLocation
  to: AircraftLocation
}

export function useAerialData() {
  const [aircraft, setAircraft] = useState<Record<string, Aircraft>>({})

  // TODO: Error handling with retry / backoff
  const { data } = useSWR('/api/adsb/v2/point/41.8240/-71.4128/25', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 2500,
  })

  useEffect(() => {
    if (data) {
      setAircraft((prev) => {
        const newAircraftMap = processAerialUpdate(prev, data)

        return pruneStaleAircraft(newAircraftMap, data.now)
      })
    }
  }, [data])

  const lineSegments = useMemo(() => {
    return Object.values(aircraft).flatMap((aircraft) => {
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
  }, [aircraft])

  const lineLayer = useMemo(() => {
    return new LineLayer<LineSegment>({
      id: 'aerial-layer',
      data: lineSegments,
      getColor: () => [56, 189, 248],
      getSourcePosition: (segment) => [segment.from.lon, segment.from.lat],
      getTargetPosition: (segment) => [segment.to.lon, segment.to.lat],
      getWidth: 2,
      pickable: true,
    })
  }, [lineSegments])

  return lineLayer
}
