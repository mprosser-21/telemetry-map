import ReactMapGL from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function TelemetryMap() {
  return (
    <ReactMapGL
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      attributionControl={false}
      initialViewState={{
        latitude: 41.824,
        longitude: -71.4128,
        zoom: 12,
      }}
      mapStyle={import.meta.env.VITE_MAPBOX_STYLE}
    />
  )
}
