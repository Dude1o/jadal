import { useState } from "react";
import { useFieldContext } from "./form-context";
import { useQuery } from "@tanstack/react-query";
import { FieldWrapper } from "./field-wrapper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";
import { Spinner } from "../spinner";
import { ScrollArea } from "../scroll-area";

interface AsyncSelectFieldProps<T> {
  label: string;
  placeholder?: string;
  queryOptions: () => any;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => string;
}

export function AsyncSelectField<T>({
  label,
  placeholder,
  queryOptions,
  getOptionLabel,
  getOptionValue,
}: AsyncSelectFieldProps<T>) {
  const field = useFieldContext<string | null>();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // ✅ Load options immediately (not just when opened)
  const { data, isLoading } = useQuery(queryOptions());

  // ✅ Ensure options is an array (handle API responses with nested data)
  const options = Array.isArray(data) ? data : ((data as any)?.data ?? []);

  // ✅ Find selected option - normalize values to string for comparison
  const selectedOption = (options as T[]).find(
    (item) => String(getOptionValue(item)) === String(field.state.value),
  );

  const selectedLabel = selectedOption ? getOptionLabel(selectedOption) : null;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    field.handleChange(null as any);
  };

  return (
    <FieldWrapper
      label={label}
      htmlFor={field.name}
      errors={field.state.meta.errors}
    >
      <Popover open={open} onOpenChange={handleOpenChange} modal>
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            onBlur={field.handleBlur}
            disabled={isLoading}
            className="w-full justify-between border-2 border-secondary font-normal h-auto min-h-10"
          >
            <span
              className={cn(
                "text-left whitespace-normal break-words",
                !selectedLabel && "text-muted-foreground",
              )}
            >
              {selectedLabel
                ? selectedLabel
                : (placeholder ?? getTranslation(t, "common.actions.select"))}
            </span>
            <div className="flex items-center gap-1 ml-2 shrink-0">
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
          onWheel={(e) => e.stopPropagation()}
        >
          <Command>
            <CommandInput
              placeholder={`${getTranslation(t, "common.actions.search")}...`}
            />
            <CommandList className="max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  <Spinner />
                </div>
              ) : options.length === 0 ? (
                <CommandEmpty>
                  {getTranslation(t, "common.labels.noResults")}
                </CommandEmpty>
              ) : (
                <ScrollArea className="h-[300px]">
                  <CommandGroup>
                    {(options as T[]).map((item) => (
                      <CommandItem
                        key={getOptionValue(item)}
                        value={getOptionLabel(item)}
                        onSelect={() => {
                          field.handleChange(getOptionValue(item) as any);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            String(field.state.value) ===
                              String(getOptionValue(item))
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {getOptionLabel(item)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}
