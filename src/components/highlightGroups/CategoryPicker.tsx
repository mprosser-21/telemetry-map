import type { AircraftCategory } from '@/types/aerial'
import { Badge } from '../ui/badge'

export const CATEGORY_OPTIONS: AircraftCategory[] = [
  'fixedWing',
  'rotorcraft',
  'other',
]

const CATEGORY_LABELS: Record<AircraftCategory, string> = {
  fixedWing: 'Fixed Wing',
  rotorcraft: 'Rotorcraft',
  other: 'Other',
}

export default function CategoryPicker({
  currentCategories,
  onChange,
}: {
  currentCategories: AircraftCategory[]
  onChange: (newCategories: AircraftCategory[]) => void
}) {
  const toggleCategory = (category: AircraftCategory) => {
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((currentValue) => currentValue !== category)
      : [...currentCategories, category]

    onChange(newCategories)
  }
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_OPTIONS.map((category) => {
        const selected = currentCategories.includes(category)

        return (
          <Badge
            key={category}
            className="cursor-pointer"
            asChild
            variant={selected ? 'default' : 'outline'}
          >
            <button
              type="button"
              onClick={() => {
                toggleCategory(category)
              }}
            >
              {CATEGORY_LABELS[category]}
            </button>
          </Badge>
        )
      })}
    </div>
  )
}
