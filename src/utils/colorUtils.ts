import type { Aircraft, AircraftHighlightGroup } from '../types/aerial'
import { getAircraftMatchingHighlightGroup } from './aerialUtils'
import type { RGB, RGBA, HighlightGroupColorKey } from '../types/color'

const DEFAULT_AIRBORNE_COLOR: RGB = [56, 189, 248]
const DEFAULT_GROUND_COLOR: RGB = [163, 163, 163]
const DEFAULT_HALO_LINE_COLOR: RGB = [125, 211, 252]
const DEFAULT_HALO_FILL_COLOR: RGB = [56, 189, 248]

export const HIGHLIGHT_GROUP_COLORS: Record<
  HighlightGroupColorKey,
  { label: string; rgb: RGB }
> = {
  emerald: { label: 'Emerald', rgb: [52, 211, 153] },
  orange: { label: 'Orange', rgb: [251, 146, 60] },
  violet: { label: 'Purple', rgb: [192, 132, 252] },
  rose: { label: 'Rose', rgb: [251, 113, 133] },
  yellow: { label: 'Yellow', rgb: [250, 204, 21] },
}

export function withAlpha(color: RGB, alpha: number): RGBA {
  return [...color, alpha]
}

export function toRgbString(color: RGB): string {
  return `rgb(${color[0]} ${color[1]} ${color[2]})`
}

export function getAircraftHighlightColor(
  aircraft: Aircraft,
  highlightGroups: AircraftHighlightGroup[],
): RGB | null {
  const matchingGroup = getAircraftMatchingHighlightGroup(
    aircraft,
    highlightGroups,
  )

  return matchingGroup ? HIGHLIGHT_GROUP_COLORS[matchingGroup.color].rgb : null
}

export function getAircraftBaseColor(
  aircraft: Aircraft,
  highlightGroups: AircraftHighlightGroup[],
): RGB {
  return (
    getAircraftHighlightColor(aircraft, highlightGroups) ??
    (aircraft.altitude === 'ground'
      ? DEFAULT_GROUND_COLOR
      : DEFAULT_AIRBORNE_COLOR)
  )
}

export function getAircraftIconColor(
  aircraft: Aircraft,
  highlightGroups: AircraftHighlightGroup[],
  selectedAircraftHex: string | undefined,
): RGBA {
  const alpha =
    selectedAircraftHex && aircraft.hex !== selectedAircraftHex ? 90 : 255

  return withAlpha(getAircraftBaseColor(aircraft, highlightGroups), alpha)
}

export function getAircraftTrailColor(
  aircraft: Aircraft | undefined,
  highlightGroups: AircraftHighlightGroup[],
  selectedAircraftHex: string,
  tripHex: string,
): RGBA {
  const baseColor = aircraft
    ? getAircraftBaseColor(aircraft, highlightGroups)
    : DEFAULT_AIRBORNE_COLOR
  const alpha =
    selectedAircraftHex && tripHex !== selectedAircraftHex ? 60 : 180

  return withAlpha(baseColor, alpha)
}

export function getSelectedAircraftTrailColor(
  aircraft: Aircraft | undefined,
  highlightGroups: AircraftHighlightGroup[],
): RGBA {
  const baseColor = aircraft
    ? getAircraftBaseColor(aircraft, highlightGroups)
    : DEFAULT_HALO_LINE_COLOR

  return withAlpha(baseColor, 230)
}

export function getAircraftHaloColors(
  aircraft: Aircraft | undefined,
  highlightGroups: AircraftHighlightGroup[],
): { lineColor: RGBA; fillColor: RGBA } {
  const isGroundAircraft = aircraft?.altitude === 'ground'
  const highlightColor =
    aircraft && !isGroundAircraft
      ? getAircraftHighlightColor(aircraft, highlightGroups)
      : null

  const lineBaseColor = isGroundAircraft
    ? DEFAULT_GROUND_COLOR
    : (highlightColor ?? DEFAULT_HALO_LINE_COLOR)

  const fillBaseColor = isGroundAircraft
    ? DEFAULT_GROUND_COLOR
    : (highlightColor ?? DEFAULT_HALO_FILL_COLOR)

  return {
    lineColor: withAlpha(lineBaseColor, 220),
    fillColor: withAlpha(fillBaseColor, 30),
  }
}
