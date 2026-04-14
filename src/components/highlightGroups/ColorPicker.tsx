import { Button } from '../ui/button'
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from '../ui/combobox'
import type { HighlightGroupColorKey } from '@/types/aerial'
import { HIGHLIGHT_GROUP_COLORS } from '@/utils/colorUtils'

export default function ColorPicker({
  currentColor,
  onChange,
}: {
  currentColor: HighlightGroupColorKey
  onChange: (newColor: HighlightGroupColorKey) => void
}) {
  const options = Object.entries(HIGHLIGHT_GROUP_COLORS)

  return (
    <Combobox
      value={currentColor}
      onValueChange={(nextValue) => {
        if (!nextValue) return
        onChange(nextValue as HighlightGroupColorKey)
      }}
    >
      <Button
        asChild
        variant="outline"
        className="w-full justify-between bg-card"
      >
        <ComboboxTrigger>
          <span className="flex items-center gap-2">
            <span
              className="size-3 rounded-sm border border-black/10"
              style={{
                backgroundColor: `rgb(${HIGHLIGHT_GROUP_COLORS[currentColor].rgb.join(' ')})`,
              }}
            />
            <ComboboxValue>
              {HIGHLIGHT_GROUP_COLORS[currentColor].label}
            </ComboboxValue>
          </span>
        </ComboboxTrigger>
      </Button>
      <ComboboxContent className="min-w-0">
        <ComboboxList>
          {options.map(([colorKey, color]) => (
            <ComboboxItem key={colorKey} value={colorKey}>
              <span
                className="size-3 rounded-sm border border-black/10"
                style={{
                  backgroundColor: `rgb(${color.rgb.join(' ')})`,
                }}
              />
              {color.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
