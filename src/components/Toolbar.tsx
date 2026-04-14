import { SlidersHorizontalIcon, RouteIcon } from 'lucide-react'
import { Button } from './ui/button'
import { ButtonGroup } from './ui/button-group'
import type { Aircraft } from '@/types/aerial'
import FlightInspector from './FlightInspector'

export default function Toolbar({
  selectedAircraft,
  detailsOpen,
  setDetailsOpen,
}: {
  selectedAircraft?: Aircraft
  detailsOpen: boolean
  setDetailsOpen: (open: boolean) => void
}) {
  return (
    <div className="absolute inset-x-0 top-6 z-50">
      <div className="absolute right-6 top-0">
        <ButtonGroup>
          <Button variant="outline" aria-label="Filter">
            <SlidersHorizontalIcon />
          </Button>
          <Button
            variant="outline"
            aria-label={
              detailsOpen ? 'Hide flight details' : 'Show flight details'
            }
            aria-pressed={detailsOpen}
            onClick={() => {
              setDetailsOpen(!detailsOpen)
            }}
          >
            <RouteIcon />
          </Button>
        </ButtonGroup>
      </div>
      <FlightInspector aircraft={selectedAircraft} open={detailsOpen} />
    </div>
  )
}
