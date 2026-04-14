import type { components, paths } from "./adsb.generated";
import type { HighlightGroupColorKey } from "./color";

export type ADSBData =
  paths["/v2/point/{lat}/{lon}/{radius}"]["get"]["responses"]["200"]["content"]["application/json"];

export type Aircraft = {
  hex: string;
  category?: string | null;
  flight?: string | null;
  lat?: number | null;
  lon?: number | null;
  direction?: number | null;
  altitude?: string | number | null;
  speed?: number | null;
  designator?: string | null;
  data: components["schemas"]["V2Response_AcItem"];
  lastSeenAt: number;
  history: Array<AircraftLocation>;
};

export type AircraftLocation = {
  lat: number;
  lon: number;
  altitude?: string | number | null;
  ts: number;
};

export type AircraftMap = Record<string, Aircraft>;

export type AircraftCategory = "fixedWing" | "rotorcraft" | "other";

type AerialIconName = AircraftCategory;

export type AircraftHighlightGroup = {
  id: string;
  name: string;
  color: HighlightGroupColorKey;
  categories: AircraftCategory[];
  altitudeRange: [number, number];
  speedRange: [number, number];
};

export type AerialIconMapping = {
  [key in AerialIconName]: {
    x: number;
    y: number;
    width: number;
    height: number;
    anchorX: number;
    anchorY: number;
    mask: boolean;
  };
};

export type AircraftTrip = {
  hex: string;
  path: [number, number, number][];
  timestamps: number[];
};
