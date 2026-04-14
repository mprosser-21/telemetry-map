import ReactMapGL from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import useAerialLayers from '../hooks/useAerialLayer'
import DeckGL from 'deck.gl'
import useAircraft from '../hooks/useAircraft'
import { useState } from 'react'
import Toolbar from './Toolbar'

const INITIAL_VIEW_STATE = {
  latitude: 40.7128,
  longitude: -74.006,
  zoom: 8,
}

export default function MapView() {
  const aircraftMap = useAircraft()
  const [selectedAircraftHex, setSelectedAircraftHex] = useState<string>('')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const handleSelectedAircraftHexChange = (hex: string) => {
    setSelectedAircraftHex(hex)
    setDetailsOpen(Boolean(hex))
  }
  const aerialLayers = useAerialLayers(
    aircraftMap,
    selectedAircraftHex,
    handleSelectedAircraftHexChange,
  )

  return (
    <div className="relative h-full w-full">
      <Toolbar
        selectedAircraft={aircraftMap[selectedAircraftHex]}
        detailsOpen={detailsOpen}
        setDetailsOpen={setDetailsOpen}
      />

      <DeckGL
        controller={true}
        initialViewState={INITIAL_VIEW_STATE}
        layers={aerialLayers}
        onClick={(info) => {
          if (!info.object) {
            handleSelectedAircraftHexChange('')
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
    </div>
  )
}
