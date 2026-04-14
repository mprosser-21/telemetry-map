import ReactMapGL from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import useAerialLayers from '../hooks/useAerialLayer'
import DeckGL from 'deck.gl'
import useAircraft from '../hooks/useAircraft'
import { useState } from 'react'
import FlightInspector from './FlightInspector'

const INITIAL_VIEW_STATE = {
  latitude: 41.824,
  longitude: -71.4128,
  zoom: 12,
}

export default function MapView() {
  const aircraftMap = useAircraft()
  const [selectedAircraftHex, setSelectedAircraftHex] = useState<string>('')
  const [showFlightDetails, setShowFlightDetails] = useState(true)
  const aerialLayers = useAerialLayers(
    aircraftMap,
    selectedAircraftHex,
    setSelectedAircraftHex,
  )
  const selectedAircraft = aircraftMap[selectedAircraftHex]

  return (
    <>
      {showFlightDetails ? <FlightInspector aircraft={selectedAircraft} /> : null}
      {selectedAircraft ? (
        <button
          type="button"
          className="absolute right-4 top-4 z-50 rounded-full border border-neutral-500 bg-neutral-800/90 px-3 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition hover:bg-neutral-700"
          onClick={() => setShowFlightDetails((current) => !current)}
        >
          {showFlightDetails ? 'Hide details' : 'Show details'}
        </button>
      ) : null}
      <DeckGL
        controller={true}
        initialViewState={INITIAL_VIEW_STATE}
        layers={aerialLayers}
        onClick={(info) => {
          if (!info.object) {
            setSelectedAircraftHex('')
            setShowFlightDetails(true)
          }
        }}
      >
        <ReactMapGL
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          attributionControl={false}
          mapStyle={import.meta.env.VITE_MAPBOX_STYLE}
          reuseMaps={true}
        >
          {/* <NavigationControl visualizePitch={true} /> */}
        </ReactMapGL>
      </DeckGL>
    </>
  )
}
