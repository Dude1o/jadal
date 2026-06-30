import { Checkbox } from "../checkbox";
import { Label } from "../label";
import { FieldError } from "./field-error";
import { useFieldContext } from "./form-context";

export function CheckboxField({ label }: { label: string }) {
  const field = useFieldContext<boolean>();
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={field.name}
        checked={field.state.value}
        onBlur={field.handleBlur}
        onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
      />
      <Label htmlFor={field.name} className="cursor-pointer">
        {label}
      </Label>
      <FieldError errors={field.state.meta.errors} />
    </div>
  );
}
