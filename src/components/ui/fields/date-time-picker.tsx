import { useState, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Field, FieldGroup, FieldLabel } from "../field";
import { Input } from "../input";
import { FieldWrapper } from "./field-wrapper";
import { useFieldContext } from "./form-context";
import { format, setHours, setMinutes } from "date-fns";
import { Calendar } from "../calendar";
import { cn } from "@/lib/cn";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function DateTimePickerField({ label }: { label: string }) {
  const field = useFieldContext<Date | undefined>();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    if (field.state.value) {
      setLocalTime(format(field.state.value, "HH:mm"));
    } else {
      setLocalTime("");
    }
  }, [field.state.value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      field.handleChange(undefined);
      setLocalTime("");
      setOpen(false);
      return;
    }
    const current = field.state.value;
    if (current) {
      date = setHours(setMinutes(date, current.getMinutes()), current.getHours());
    }
    field.handleChange(date);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    setLocalTime(timeValue);
    
    if (!timeValue) return;
    
    const [hours, minutes] = timeValue.split(":").map(Number);
    const current = field.state.value ? new Date(field.state.value) : new Date();
    field.handleChange(setMinutes(setHours(current, hours), minutes));
  };

  return (
    <FieldWrapper
      label={label}
      htmlFor={field.name}
      errors={field.state.meta.errors}
    >
      <FieldGroup className="flex-row">
        <Field>
          <FieldLabel htmlFor={`${field.name}-date`}>Date</FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id={`${field.name}-date`}
                variant="outline"
                onBlur={field.handleBlur}
                className={cn(
                  "w-32 justify-between font-normal",
                  !field.state.value && "text-muted-foreground",
                )}
              >
                {field.state.value
                  ? format(field.state.value, "PPP")
                  : getTranslation(t, "common.labels.pickDate")}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={field.state.value}
                captionLayout="dropdown"
                defaultMonth={field.state.value}
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
        </Field>
        <Field className="w-32">
          <FieldLabel htmlFor={`${field.name}-time`}>Time</FieldLabel>
          <Input
            type="time"
            id={`${field.name}-time`}
            value={localTime}
            onBlur={field.handleBlur}
            onChange={handleTimeChange}
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </Field>
      </FieldGroup>
    </FieldWrapper>
  );
}
