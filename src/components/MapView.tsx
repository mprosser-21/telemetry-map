import ReactMapGL, { NavigationControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import useAerialLayers from '../hooks/useAerialLayer'
import DeckGL from 'deck.gl'
import useAircraft from '../hooks/useAircraft'

const INITIAL_VIEW_STATE = {
  latitude: 41.824,
  longitude: -71.4128,
  zoom: 12,
}

export default function MapView() {
  const aircraftMap = useAircraft()
  const aerialLayers = useAerialLayers(aircraftMap)

  return (
    <DeckGL
      controller={true}
      initialViewState={INITIAL_VIEW_STATE}
      layers={aerialLayers}
    >
      <ReactMapGL
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        attributionControl={false}
        mapStyle={import.meta.env.VITE_MAPBOX_STYLE}
        reuseMaps={true}
      >
        <NavigationControl visualizePitch={true} />
      </ReactMapGL>
    </DeckGL>
  )
}
