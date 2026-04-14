import { Slider } from "../ui/slider";

export default function RangePicker({
  label,
  range,
  min,
  max,
  step,
  unit,
  onValueChange,
}: {
  label: string;
  range: [number, number];
  min: number;
  max: number;
  step: number;
  unit: string;
  onValueChange: (value: [number, number]) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase text-muted-foreground">
        <span>{label}</span>
        <span>
          {range[0].toLocaleString()} - {range[1].toLocaleString()}
          {` ${unit}`}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={range}
        onValueChange={(value) => {
          if (value.length !== 2) return;

          onValueChange([value[0] ?? min, value[1] ?? max]);
        }}
      />
    </div>
  );
}
