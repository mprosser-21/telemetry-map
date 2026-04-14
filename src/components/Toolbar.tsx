import type { Dispatch, SetStateAction } from 'react'
import { SlidersHorizontalIcon, RouteIcon } from 'lucide-react'
import { Button } from './ui/button'
import { ButtonGroup } from './ui/button-group'
import type { Aircraft, AircraftHighlightGroup } from '@/types/aerial'
import FlightInspector from './FlightInspector'
import HighlightGroupsPanel from './highlightGroups/HighlightGroupsPanel'
import type { ActivePanel } from './MapView'

export default function Toolbar({
  selectedAircraft,
  activePanel,
  setActivePanel,
  highlightGroups,
  setHighlightGroups,
}: {
  selectedAircraft?: Aircraft
  activePanel: ActivePanel
  setActivePanel: Dispatch<SetStateAction<ActivePanel>>
  highlightGroups: AircraftHighlightGroup[]
  setHighlightGroups: Dispatch<SetStateAction<AircraftHighlightGroup[]>>
}) {
  return (
    <div className="absolute inset-x-0 top-6 z-50">
      <div className="absolute left-6 top-0">
        <ButtonGroup>
          <Button
            variant="outline"
            aria-label={
              activePanel === 'filters' ? 'Hide filters' : 'Show filters'
            }
            aria-pressed={activePanel === 'filters'}
            onClick={() => {
              setActivePanel((currentPanel) =>
                currentPanel === 'filters' ? undefined : 'filters',
              )
            }}
          >
            <SlidersHorizontalIcon />
          </Button>
          <Button
            variant="outline"
            aria-label={
              activePanel === 'details'
                ? 'Hide flight details'
                : 'Show flight details'
            }
            aria-pressed={activePanel === 'details'}
            onClick={() => {
              setActivePanel((currentPanel) =>
                currentPanel === 'details' ? undefined : 'details',
              )
            }}
          >
            <RouteIcon />
          </Button>
        </ButtonGroup>
      </div>
      {activePanel ? (
        <div
          className={`absolute top-12 left-6 overflow-hidden rounded-lg border border-border bg-card shadow-lg ${
            activePanel === 'filters' ? 'w-80' : 'w-60'
          }`}
        >
          {activePanel === 'filters' && (
            <HighlightGroupsPanel
              groups={highlightGroups}
              setGroups={setHighlightGroups}
            />
          )}
          {activePanel === 'details' && (
            <FlightInspector aircraft={selectedAircraft} />
          )}
        </div>
      ) : null}
    </div>
  )
}
