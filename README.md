# Telemetry Map

Small application to display aircraft traffic in a 100 nautical miles radius around New York City. Data is courtesy of [adsb.lol](https://api.adsb.lol/docs).

<img width="768" alt="telemetry-map" src="https://github.com/user-attachments/assets/8e992c43-bc8f-4e55-a506-c7101b398645" />

**Stack**
* React
* Typescript
* Vite
* react-map-gl
* deck.gl
* Tailwind CSS
* ShadCN
* Vercel SWR

## Getting Started

1. Install depedencies
2. Create a .env.local with the Mapbox environment variables

```
VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-token
VITE_MAPBOX_STYLE=your-mapbox-style-url
```
3. Start dev server: ```pnpm run dev```
