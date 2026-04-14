import { IconLayer, ScatterplotLayer } from "deck.gl";
import { useMemo, useState } from "react";
import type {
  Aircraft,
  AircraftHighlightGroup,
  AircraftMap,
} from "../types/aerial";
import {
  AERIAL_ICON_MAPPING,
  getAerialIcon,
  getAircraftCategory,
  getAircraftPosition,
} from "../utils/aerialUtils";
import {
  getAircraftHaloColors,
  getAircraftIconColor,
} from "../utils/colorUtils";

// Layer for icons at aircraft locations and a layer to add hover halo effect
export default function useIconLayers(
  aircraftMap: AircraftMap,
  selectedAircraftHex: string,
  setSelectedAircraftHex: (hex: string) => void,
  highlightGroups: AircraftHighlightGroup[],
) {
  const [hoveredAircraftHex, setHoveredAircraftHex] = useState("");

  const hoverLayer = useMemo(() => {
    const hoveredAircraft = aircraftMap[hoveredAircraftHex];
    const data = hoveredAircraft ? [hoveredAircraft] : [];
    const { lineColor, fillColor } = getAircraftHaloColors(
      hoveredAircraft,
      highlightGroups,
    );

    return new ScatterplotLayer<Aircraft>({
      id: "hover-halo",
      data,
      getPosition: (aircraft) => getAircraftPosition(aircraft),
      getRadius: 1200,
      radiusUnits: "meters",
      radiusMinPixels: 10,
      radiusMaxPixels: 22,
      stroked: true,
      filled: true,
      getLineColor: lineColor,
      getFillColor: fillColor,
      lineWidthMinPixels: 1,
      billboard: false,
      pickable: false,
    });
  }, [aircraftMap, hoveredAircraftHex, highlightGroups]);

  const iconLayer = useMemo(() => {
    const aircraftLocations = Object.values(aircraftMap);

    return new IconLayer<Aircraft>({
      id: "aircraft-icons",
      data: aircraftLocations,
      iconAtlas: "/aerial-icon-atlas.svg",
      iconMapping: AERIAL_ICON_MAPPING,
      onHover: (info) => {
        setHoveredAircraftHex(info.object?.hex ?? "");
      },
      onClick: (info) => {
        if (info.object) {
          setSelectedAircraftHex(info.object.hex);
        }
      },
      getPosition: (aircraft) => getAircraftPosition(aircraft),
      getAngle: (aircraft) =>
        -(getAircraftCategory(aircraft.category) === "fixedWing"
          ? (aircraft.direction ?? 0)
          : 0),
      getIcon: (aircraft) => getAerialIcon(aircraft.category),
      getColor: (aircraft) =>
        getAircraftIconColor(aircraft, highlightGroups, selectedAircraftHex),
      updateTriggers: {
        getColor: [selectedAircraftHex, highlightGroups],
      },
      getSize: 16,
      sizeUnits: "pixels",
      sizeScale: 1,
      pickable: true,
      billboard: false,
    });
  }, [
    aircraftMap,
    selectedAircraftHex,
    setSelectedAircraftHex,
    highlightGroups,
  ]);

  return [hoverLayer, iconLayer];
}
