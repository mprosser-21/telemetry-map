import type {
  ADSBData,
  AerialIconMapping,
  Aircraft,
  AircraftHighlightGroup,
  AircraftCategory,
  AircraftMap,
} from '../types/aerial'

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

export function getAircraftPosition(
  aircraft: Aircraft,
): [number, number, number] {
  return [
    aircraft.lon ?? 0,
    aircraft.lat ?? 0,
    normalizeAltitude(aircraft.altitude),
  ]
}

export const AERIAL_ICON_MAPPING: AerialIconMapping = {
  fixedWing: {
    x: 0,
    y: 0,
    width: 32,
    height: 32,
    anchorX: 16,
    anchorY: 16,
    mask: true,
  },
  rotorcraft: {
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
  return getAircraftCategory(category)
}

export function getAircraftCategory(
  category?: string | null,
): AircraftCategory {
  if (category === 'A7') {
    return 'rotorcraft'
  }

  if (category?.startsWith('A')) {
    return 'fixedWing'
  }

  return 'other'
}

function getNumericAltitude(altitude?: string | number | null) {
  if (altitude == null) {
    return null
  }

  if (altitude === 'ground') {
    return 0
  }

  const numericAltitude =
    typeof altitude === 'number' ? altitude : Number.parseFloat(altitude)

  return Number.isNaN(numericAltitude) ? null : numericAltitude
}

function getNumericSpeed(speed?: number | null) {
  return speed == null || Number.isNaN(speed) ? null : speed
}

export function getAircraftMatchingHighlightGroup(
  aircraft: Aircraft,
  groups: AircraftHighlightGroup[],
) {
  return groups.find((group) => {
    const category = getAircraftCategory(aircraft.category)
    const altitude = getNumericAltitude(aircraft.altitude)
    const speed = getNumericSpeed(aircraft.speed)

    const matchesCategory = group.categories.includes(category)
    const matchesAltitude =
      altitude != null &&
      altitude >= group.altitudeRange[0] &&
      altitude <= group.altitudeRange[1]
    const matchesSpeed =
      speed != null &&
      speed >= group.speedRange[0] &&
      speed <= group.speedRange[1]

    return matchesCategory && matchesAltitude && matchesSpeed
  })
}
