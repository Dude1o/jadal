import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { FieldWrapper } from "./field-wrapper";
import { useFieldContext } from "./form-context";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";

interface SelectFieldProps {
  label: string;
  placeholder?: string;
  options: { label: string; value: string }[];
}

export function SelectField({ label, placeholder, options }: SelectFieldProps) {
  const { t } = useTranslation();
  const field = useFieldContext<string>();

  return (
    <FieldWrapper
      label={label}
      htmlFor={field.name}
      errors={field.state.meta.errors}
    >
      <Select value={field.state.value} onValueChange={field.handleChange}>
        <SelectTrigger
          id={field.name}
          onBlur={field.handleBlur}
          className="border-secondary border-2"
        >
          <SelectValue placeholder={placeholder ?? getTranslation(t, "common.actions.select")} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}
