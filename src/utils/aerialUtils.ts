import type { ADSBData, AerialIconMapping, AircraftMap } from '../types/aerial'

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
    const { hex, lat, lon, flight, category, track } = update
    if (lat != null && lon != null) {
      const existingHistory = newAircraftMap[hex]?.history || []
      newAircraftMap[hex] = {
        hex,
        category,
        lat,
        lon,
        flight,
        track,
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

export const AERIAL_ICON_MAPPING: AerialIconMapping = {
  plane: {
    x: 0,
    y: 0,
    width: 32,
    height: 32,
    anchorX: 16,
    anchorY: 16,
    mask: true,
  },
  helicopter: {
    x: 32,
    y: 0,
    width: 32,
    height: 32,
    anchorX: 16,
    anchorY: 16,
    mask: true,
  },
  other: {
    x: 64,
    y: 0,
    width: 32,
    height: 32,
    anchorX: 16,
    anchorY: 16,
    mask: true,
  },
}

export function getAerialIcon(category?: string | null) {
  if (category === 'A7') {
    return 'helicopter'
  }

  if (category?.startsWith('A')) {
    return 'plane'
  }

  return 'other'
}
