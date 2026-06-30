import { useState } from "react";
import { useFieldContext } from "./form-context";
import { useQuery } from "@tanstack/react-query";
import { FieldWrapper } from "./field-wrapper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn, truncate } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";
import { Spinner } from "../spinner";

interface AsyncMultiSelectFieldProps<T> {
  label: string;
  placeholder?: string;
  queryOptions: () => any;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => string;
}

export function AsyncMultiSelectField<T>({
  label,
  placeholder,
  queryOptions,
  getOptionLabel,
  getOptionValue,
}: AsyncMultiSelectFieldProps<T>) {
  const field = useFieldContext<string[]>();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery(queryOptions());

  const options = Array.isArray(data) ? data : ((data as any)?.data ?? []);

  const selected: string[] = Array.isArray(field.state.value)
    ? field.state.value
    : [];

  const selectedOptions = (options as T[]).filter((item) =>
    selected.includes(String(getOptionValue(item))),
  );

  const toggle = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    field.handleChange(next);
  };

  const removeOne = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    field.handleChange(selected.filter((v) => v !== val));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    field.handleChange([]);
  };

  return (
    <FieldWrapper
      label={label}
      htmlFor={field.name}
      errors={field.state.meta.errors}
    >
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            onBlur={field.handleBlur}
            disabled={isLoading}
            className="w-full min-h-9 h-auto justify-between border-2 border-secondary font-normal"
          >
            <div className="flex flex-wrap gap-1 py-0.5">
              {selected.length === 0 ? (
                <span className="text-muted-foreground">
                  {placeholder ?? getTranslation(t, "common.actions.select")}
                </span>
              ) : (
                selectedOptions.map((item) => (
                  <Badge
                    key={getOptionValue(item)}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    <span>{truncate(getOptionLabel(item), 20)}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) =>
                        removeOne(e, String(getOptionValue(item)))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          removeOne(e as any, String(getOptionValue(item)));
                      }}
                      className="rounded-sm hover:bg-muted cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))
              )}
            </div>

            <div className="flex items-center gap-1 ml-2 shrink-0">
              {selected.length > 0 && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={clearAll}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") clearAll(e as any);
                  }}
                  className="rounded-sm hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </span>
              )}
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
                    {(options as T[]).map((item) => {
                      const val = String(getOptionValue(item));
                      const isSelected = selected.includes(val);
                      return (
                        <CommandItem
                          key={val}
                          value={getOptionLabel(item)}
                          onSelect={() => toggle(val)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {getOptionLabel(item)}
                        </CommandItem>
                      );
                    })}
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
