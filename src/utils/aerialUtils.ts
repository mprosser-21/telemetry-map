import type { ADSBData, AircraftMap } from '../types/aerial'

export async function fetcher(url: string): Promise<ADSBData> {
  const res = await fetch(url)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`An error occurred while fetching the data: ${res.status}`)
  }
  return data as ADSBData
}

export function processAerialUpdate(
  existingAircraftMap: AircraftMap,
  adsbUpdate: ADSBData,
) {
  const newAircraftMap = { ...existingAircraftMap }
  const { ac, now } = adsbUpdate

  for (const update of ac) {
    const { hex, lat, lon, flight } = update
    if (lat != null && lon != null) {
      const existingHistory = newAircraftMap[hex]?.history || []
      newAircraftMap[hex] = {
        hex,
        lat,
        lon,
        flight,
        lastSeenAt: now,
        history: [...existingHistory, { lat, lon, ts: now }],
      }
    }
  }

  return newAircraftMap
}

const STALE_THRESHOLD = 120

export function pruneStaleAircraft(aircraftMap: AircraftMap, now: number) {
  return Object.fromEntries(
    Object.entries(aircraftMap).filter(
      ([_, aircraft]) => aircraft.lastSeenAt > now - STALE_THRESHOLD,
    ),
  )
}
