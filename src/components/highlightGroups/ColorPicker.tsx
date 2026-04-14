import type { HighlightGroupColorKey } from "@/types/color";
import { HIGHLIGHT_GROUP_COLORS, toRgbString } from "@/utils/colorUtils";
import { Button } from "../ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "../ui/combobox";

export default function ColorPicker({
  currentColor,
  onChange,
}: {
  currentColor: HighlightGroupColorKey;
  onChange: (newColor: HighlightGroupColorKey) => void;
}) {
  const options = Object.entries(HIGHLIGHT_GROUP_COLORS);

  return (
    <Combobox
      value={currentColor}
      onValueChange={(nextValue) => {
        if (!nextValue) return;
        onChange(nextValue as HighlightGroupColorKey);
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
                backgroundColor: toRgbString(
                  HIGHLIGHT_GROUP_COLORS[currentColor].rgb,
                ),
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
                  backgroundColor: toRgbString(color.rgb),
                }}
              />
              {color.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
