import { useEffect, useState } from "react";
import useSWR from "swr";
import type { AircraftMap } from "../types/aerial";
import {
  fetcher,
  processAerialUpdate,
  pruneStaleAircraft,
} from "../utils/aerialUtils";

// Fetch data from adsb.lol API and update state with the latest data
export default function useAircraft() {
  const [aircraftMap, setAircraftMap] = useState<AircraftMap>({});

  // TODO: Error handling with retry / backoff
  const { data } = useSWR("/api/adsb/v2/point/40.7128/-74.0060/100", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 2500,
  });

  useEffect(() => {
    if (data) {
      setAircraftMap((prev) => {
        const newAircraftMap = processAerialUpdate(prev, data);

        return pruneStaleAircraft(newAircraftMap, data.now);
      });
    }
  }, [data]);

  return aircraftMap;
}
