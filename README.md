# Telemetry Map

Small application to display aircraft traffic in a 100 nautical miles radius around New York City. Data is courtesy of [adsb.lol](https://api.adsb.lol/docs) and set to poll every 2.5 seconds.

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

## Features

### Flight Inspector

Click on individual flights to inspect basic details (flight number, aircraft type, direction, speed, and elevation) and a full path view of it's recent track.

<img width="768" alt="Individual Flight" src="https://github.com/user-attachments/assets/7e1fbc21-e5de-4a95-af1b-e0f6433f98f9" />

### Highlighting

Create and add groups to highlight flights based on matching parameters.

<img width="768" alt="Highlight" src="https://github.com/user-attachments/assets/02095159-4049-4c96-9909-ffc629cc0729" />



