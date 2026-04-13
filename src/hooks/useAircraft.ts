import { useState, useEffect } from 'react'
import useSWR from 'swr'
import type { AircraftMap } from '../types/aerial'
import {
  fetcher,
  processAerialUpdate,
  pruneStaleAircraft,
} from '../utils/aerialUtils'

export default function useAircraft() {
  const [aircraftMap, setAircraftMap] = useState<AircraftMap>({})

  // TODO: Error handling with retry / backoff
  const { data } = useSWR('/api/adsb/v2/point/41.8240/-71.4128/50', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 5000,
  })

  useEffect(() => {
    if (data) {
      setAircraftMap((prev) => {
        const newAircraftMap = processAerialUpdate(prev, data)

        return pruneStaleAircraft(newAircraftMap, data.now)
      })
    }
  }, [data])

  return aircraftMap
}
