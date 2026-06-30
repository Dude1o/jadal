import { Label } from "../label";
import { Switch } from "../switch";
import { FieldError } from "./field-error";
import { useFieldContext } from "./form-context";

export function SwitchField({ label }: { label: string }) {
  const field = useFieldContext<boolean>();
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={field.name}>{label}</Label>
      <Switch
        id={field.name}
        checked={field.state.value}
        onBlur={field.handleBlur}
        onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
      />
      <FieldError errors={field.state.meta.errors} />
    </div>
  );
}
