import { Textarea } from "../textarea";
import { FieldWrapper } from "./field-wrapper";
import { useFieldContext } from "./form-context";

interface TextareaFieldProps {
  label: string;
  placeholder?: string;
  rows?: number;
}

export function TextareaField({
  label,
  placeholder,
  rows = 4,
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  return (
    <FieldWrapper
      label={label}
      htmlFor={field.name}
      errors={field.state.meta.errors}
    >
      <Textarea
        id={field.name}
        placeholder={placeholder}
        rows={rows}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className="border-secondary border-2"
      />
    </FieldWrapper>
  );
}
