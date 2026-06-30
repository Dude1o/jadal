import { CalendarIcon } from "lucide-react";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { FieldWrapper } from "./field-wrapper";
import { useFieldContext } from "./form-context";
import { format } from "date-fns";
import { Calendar } from "../calendar";
import { cn } from "@/lib/cn";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function DatePickerField({ label }: { label: string }) {
  const field = useFieldContext<Date | undefined>();
  const { t } = useTranslation();

  return (
    <FieldWrapper
      label={label}
      htmlFor={field.name}
      errors={field.state.meta.errors}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            variant="outline"
            onBlur={field.handleBlur}
            className={cn(
              "w-full justify-start text-left font-normal border-secondary border-2",
              !field.state.value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.state.value
              ? format(field.state.value, "PPP")
              : getTranslation(t, "common.labels.pickDate")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={field.state.value}
            onSelect={(date) => field.handleChange(date)}
          />
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}
