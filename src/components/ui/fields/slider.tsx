import { Slider } from "../slider";
import { FieldWrapper } from "./field-wrapper";
import { useFieldContext } from "./form-context";

interface SliderFieldProps {
  label: string;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
}

export function SliderField({
  label,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
}: SliderFieldProps) {
  const field = useFieldContext<number>();
  return (
    <FieldWrapper
      label={label}
      htmlFor={field.name}
      errors={field.state.meta.errors}
    >
      <div className="flex items-center gap-4">
        <Slider
          id={field.name}
          min={min}
          max={max}
          step={step}
          value={[field.state.value]}
          onValueChange={([val]) => field.handleChange(val)}
          onBlur={field.handleBlur}
          className="flex-1"
        />
        {showValue && (
          <span className="w-10 text-right text-sm tabular-nums text-muted-foreground">
            {field.state.value}
          </span>
        )}
      </div>
    </FieldWrapper>
  );
}
