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
    const {
      hex,
      lat,
      lon,
      flight,
      category,
      track,
      alt_baro,
      gs,
      t,
      true_heading,
    } = update
    if (lat != null && lon != null) {
      const existingHistory = newAircraftMap[hex]?.history || []
      newAircraftMap[hex] = {
        hex,
        category,
        lat,
        lon,
        flight,
        direction: alt_baro === 'ground' ? true_heading : track,
        altitude: alt_baro,
        speed: gs,
        designator: t,
        lastSeenAt: now,
        data: update,
        history: [
          ...existingHistory,
          { lat, lon, altitude: alt_baro, ts: now },
        ],
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

const FEET_TO_METERS = 0.3048

// Normalize altitude and convert to meters
export function normalizeAltitude(altitude?: string | number | null) {
  if (altitude == null || altitude === 'ground') {
    return 0
  }

  const numericAltitude =
    typeof altitude === 'number' ? altitude : Number.parseFloat(altitude)

  if (Number.isNaN(numericAltitude)) {
    return 0
  }

  return numericAltitude * FEET_TO_METERS
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

// Many other types, but let's keep it simple for now
export function getAerialIcon(category?: string | null) {
  if (category === 'A7') {
    return 'helicopter'
  }

  if (category?.startsWith('A')) {
    return 'plane'
  }

  return 'other'
}
