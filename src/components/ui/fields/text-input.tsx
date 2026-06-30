import { isRTL } from "@/lib/utils";
import { Input } from "../input";
import { FieldWrapper } from "./field-wrapper";
import { useFieldContext } from "./form-context";

interface InputFieldProps {
  label: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
}

export function TextInputField({
  label,
  type = "text",
  placeholder,
}: InputFieldProps) {
  const field = useFieldContext<string | number>();

  return (
    <FieldWrapper
      label={label}
      htmlFor={field.name}
      errors={field.state.meta.errors}
    >
      <Input
        id={field.name}
        type={type}
        placeholder={placeholder}
        value={
          type === "number"
            ? field.state.value === ""
              ? ""
              : String(field.state.value)
            : (field.state.value as string)
        }
        onBlur={field.handleBlur}
        onChange={(e) => {
          let inputValue = e.target.value;

          if (type === "tel") {
            // 1. Remove all spaces
            let cleaned = inputValue.replace(/\s+/g, "");

            // 2. Check if it originally started with a '+'
            const hasPlus = inputValue.trim().startsWith("+");

            // 3. Remove everything that isn't a number
            cleaned = cleaned.replace(/[^0-9]/g, "");

            // 4. Re-attach the plus sign to the front if it was there
            inputValue = hasPlus ? `+${cleaned}` : cleaned;
          }

          field.handleChange(
            type === "number"
              ? inputValue === ""
                ? ""
                : Number(inputValue)
              : inputValue,
          );
        }}
        className="border-secondary border-2"
        // Force left-to-right text direction for phone numbers
        // so the "+" always stays perfectly on the left side.
        dir={type === "tel" ? "ltr" : isRTL() ? "rtl" : "ltr"}
      />
    </FieldWrapper>
  );
}
