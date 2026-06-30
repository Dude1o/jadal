import { Label } from "@/components/ui/label";
import { FieldError } from "./field-error";

export function FieldWrapper({
  label,
  htmlFor,
  children,
  errors,
  description,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  errors: unknown[];
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
      <FieldError errors={errors} />
    </div>
  );
}
