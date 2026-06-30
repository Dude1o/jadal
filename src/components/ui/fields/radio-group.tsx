import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { FieldWrapper } from "./field-wrapper";
import { useFieldContext } from "./form-context";

interface RadioGroupFieldProps {
  label: string;
  options: { label: string; value: string }[];
}

export function RadioGroupField({ label, options }: RadioGroupFieldProps) {
  const field = useFieldContext<string>();
  return (
    <FieldWrapper label={label} errors={field.state.meta.errors}>
      <RadioGroup
        value={field.state.value}
        onValueChange={field.handleChange}
        onBlur={field.handleBlur}
      >
        {options.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <RadioGroupItem
              value={opt.value}
              id={`${field.name}-${opt.value}`}
            />
            <Label
              htmlFor={`${field.name}-${opt.value}`}
              className="cursor-pointer"
            >
              {opt.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FieldWrapper>
  );
}
