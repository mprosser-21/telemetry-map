import { afterEach, describe, expect, it, vi } from "vitest";

import type {
  ADSBData,
  Aircraft,
  AircraftHighlightGroup,
} from "../types/aerial";
import {
  fetcher,
  getAircraftCategory,
  getAircraftMatchingHighlightGroup,
  normalizeAltitude,
  processAerialUpdate,
  pruneStaleAircraft,
} from "./aerialUtils";

function createAircraft(overrides: Partial<Aircraft> = {}): Aircraft {
  return {
    hex: "abc123",
    category: "A3",
    flight: "TEST123",
    lat: 41.82,
    lon: -71.41,
    direction: 90,
    altitude: 12000,
    speed: 240,
    designator: "A320",
    data: {
      hex: "abc123",
      messages: 1,
      mlat: [],
      rssi: -10,
      seen: 0,
      tisb: [],
      type: "adsb_icao",
    },
    lastSeenAt: 100,
    history: [{ lat: 41.82, lon: -71.41, altitude: 12000, ts: 100 }],
    ...overrides,
  };
}

function createAdsbData(
  overrides: Partial<ADSBData["ac"][number]> = {},
  now = 110,
): ADSBData {
  return {
    ac: [
      {
        hex: "abc123",
        messages: 10,
        mlat: [],
        rssi: -20,
        seen: 0,
        tisb: [],
        type: "adsb_icao",
        lat: 41.83,
        lon: -71.4,
        flight: "TEST123",
        category: "A3",
        track: 135,
        alt_baro: 12500,
        gs: 250,
        t: "A320",
        true_heading: 140,
        ...overrides,
      },
    ],
    ctime: now,
    msg: "No error",
    now,
    ptime: 0,
    total: 1,
  };
}

function createHighlightGroup(
  overrides: Partial<AircraftHighlightGroup> = {},
): AircraftHighlightGroup {
  return {
    id: "442f3ae7-0e34-4aa6-88e1-920e61f548ef",
    name: "Fast Fixed Wing",
    color: "emerald",
    categories: ["fixedWing"],
    altitudeRange: [10000, 20000],
    speedRange: [200, 300],
    ...overrides,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("aerialUtils", () => {
  describe("fetcher", () => {
    it("returns parsed JSON for a successful response", async () => {
      const payload = createAdsbData();

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: vi.fn().mockResolvedValue(payload),
        }),
      );

      await expect(fetcher("/api/test")).resolves.toEqual(payload);
      expect(fetch).toHaveBeenCalledWith("/api/test");
    });

    it("throws with the response status for a non-ok response", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 503,
          json: vi.fn().mockResolvedValue({ message: "unavailable" }),
        }),
      );

      await expect(fetcher("/api/test")).rejects.toThrow(
        "An error occurred while fetching the data: 503",
      );
    });
  });

  describe("normalizeAltitude", () => {
    it("converts feet to meters", () => {
      expect(normalizeAltitude(1000)).toBeCloseTo(304.8);
    });

    it("returns zero for ground, null, and invalid altitude", () => {
      expect(normalizeAltitude("ground")).toBe(0);
      expect(normalizeAltitude(null)).toBe(0);
      expect(normalizeAltitude("invalid")).toBe(0);
    });
  });

  describe("getAircraftCategory", () => {
    it("classifies rotorcraft, fixed wing, and other values", () => {
      expect(getAircraftCategory("A7")).toBe("rotorcraft");
      expect(getAircraftCategory("A3")).toBe("fixedWing");
      expect(getAircraftCategory("B2")).toBe("other");
      expect(getAircraftCategory(null)).toBe("other");
    });
  });

  describe("processAerialUpdate", () => {
    it("appends new positions to existing history and updates aircraft fields", () => {
      const existingAircraftMap = {
        abc123: createAircraft(),
      };

      const updated = processAerialUpdate(
        existingAircraftMap,
        createAdsbData(),
      );

      expect(updated.abc123).toMatchObject({
        hex: "abc123",
        lat: 41.83,
        lon: -71.4,
        altitude: 12500,
        speed: 250,
        direction: 135,
        lastSeenAt: 110,
      });
      expect(updated.abc123?.history).toHaveLength(2);
      expect(updated.abc123?.history.at(-1)).toEqual({
        lat: 41.83,
        lon: -71.4,
        altitude: 12500,
        ts: 110,
      });
    });

    it("ignores updates without coordinates", () => {
      const existingAircraftMap = {
        abc123: createAircraft(),
      };

      const updated = processAerialUpdate(
        existingAircraftMap,
        createAdsbData({ lat: null, lon: null }),
      );

      expect(updated).toEqual(existingAircraftMap);
    });

    it("adds newly seen aircraft to the map", () => {
      const updated = processAerialUpdate(
        {},
        createAdsbData({ hex: "new001", t: "B738" }, 150),
      );

      expect(updated.new001).toMatchObject({
        hex: "new001",
        designator: "B738",
        lastSeenAt: 150,
      });
      expect(updated.new001?.history).toEqual([
        {
          lat: 41.83,
          lon: -71.4,
          altitude: 12500,
          ts: 150,
        },
      ]);
    });

    it("uses true heading when the aircraft is on the ground", () => {
      const updated = processAerialUpdate(
        { abc123: createAircraft() },
        createAdsbData({
          alt_baro: "ground",
          track: 135,
          true_heading: 225,
        }),
      );

      expect(updated.abc123?.direction).toBe(225);
      expect(updated.abc123?.altitude).toBe("ground");
    });

    it("stores undefined direction when airborne track is missing", () => {
      const updated = processAerialUpdate(
        { abc123: createAircraft() },
        createAdsbData({
          alt_baro: 12000,
          track: null,
          true_heading: 310,
        }),
      );

      expect(updated.abc123?.direction).toBeNull();
    });
  });

  describe("pruneStaleAircraft", () => {
    it("removes aircraft older than the stale threshold", () => {
      const aircraftMap = {
        fresh: createAircraft({ hex: "fresh", lastSeenAt: 200 }),
        stale: createAircraft({ hex: "stale", lastSeenAt: 79 }),
      };

      expect(pruneStaleAircraft(aircraftMap, 200)).toEqual({
        fresh: aircraftMap.fresh,
      });
    });
  });

  describe("getAircraftMatchingHighlightGroup", () => {
    it("returns the first group that matches category, altitude, and speed", () => {
      const aircraft = createAircraft();
      const firstMatch = createHighlightGroup({ id: "first", color: "orange" });
      const secondMatch = createHighlightGroup({ id: "second", color: "rose" });

      expect(
        getAircraftMatchingHighlightGroup(aircraft, [firstMatch, secondMatch]),
      ).toBe(firstMatch);
    });

    it("returns undefined when required values are missing or outside the range", () => {
      const aircraft = createAircraft({ altitude: null });
      const group = createHighlightGroup();

      expect(
        getAircraftMatchingHighlightGroup(aircraft, [group]),
      ).toBeUndefined();
      expect(
        getAircraftMatchingHighlightGroup(createAircraft({ speed: 50 }), [
          group,
        ]),
      ).toBeUndefined();
    });
  });
});
