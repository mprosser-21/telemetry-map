import type { paths, components } from './adsb.generated'

export type ADSBData =
  paths['/v2/point/{lat}/{lon}/{radius}']['get']['responses']['200']['content']['application/json']

export type Aircraft = {
  hex: string
  category?: string | null
  flight?: string | null
  lat?: number | null
  lon?: number | null
  direction?: number | null
  altitude?: string | number | null
  speed?: number | null
  designator?: string | null
  data: components['schemas']['V2Response_AcItem']
  lastSeenAt: number
  history: Array<AircraftLocation>
}

export type AircraftLocation = {
  lat: number
  lon: number
  altitude?: string | number | null
  ts: number
}

export type AircraftMap = Record<string, Aircraft>

type AerialIconName = 'plane' | 'helicopter' | 'other'

export type AerialIconMapping = {
  [key in AerialIconName]: {
    x: number
    y: number
    width: number
    height: number
    anchorX: number
    anchorY: number
    mask: boolean
  }
}
