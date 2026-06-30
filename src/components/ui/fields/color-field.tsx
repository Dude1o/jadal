import { useMemo, useState, useEffect } from "react";
import { Input } from "../input";
import { Button } from "../button";
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

interface ColorFieldProps {
  label: string;
  placeholder?: string;
}

type ColorFormat = "hex" | "rgb";

function hexToRgb(hex: string) {
  const cleanHex = hex.replace("#", "");

  if (cleanHex.length !== 6) return null;

  const bigint = parseInt(cleanHex, 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(rgb: string) {
  const match = rgb.match(/\d+/g);

  if (!match || match.length < 3) return "#000000";

  const [r, g, b] = match.map(Number);

  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
      })
      .join("")
  );
}

function isRgb(value: string) {
  return value.startsWith("rgb");
}

export function ColorField({
  label,
  placeholder = "#000000",
}: ColorFieldProps) {
  const { t } = useTranslation();
  const field = useFieldContext<string>();

  const detectedFormat: ColorFormat = useMemo(() => {
    return isRgb(field.state.value || "") ? "rgb" : "hex";
  }, [field.state.value]);

  const [format, setFormat] = useState<ColorFormat>(detectedFormat);

  useEffect(() => {
    setFormat(detectedFormat);
  }, [detectedFormat]);

  const pickerValue = useMemo(() => {
    if (!field.state.value) return "#000000";

    if (format === "rgb") {
      return rgbToHex(field.state.value);
    }

    return field.state.value;
  }, [field.state.value, format]);

  return (
    <FieldWrapper
      label={label}
      htmlFor={field.name}
      errors={field.state.meta.errors}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="relative h-11 w-14 overflow-hidden border-2 border-secondary p-0"
          >
            <div
              className="h-full w-full rounded-sm"
              style={{ backgroundColor: pickerValue }}
            />

            <input
              type="color"
              value={pickerValue}
              onChange={(e) => {
                const hex = e.target.value;

                if (format === "rgb") {
                  const rgb = hexToRgb(hex);

                  if (!rgb) return;

                  field.handleChange(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
                } else {
                  field.handleChange(hex);
                }
              }}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </Button>

          <Select
            value={format}
            onValueChange={(value: ColorFormat) => {
              setFormat(value);

              if (!field.state.value) return;

              if (value === "rgb") {
                const rgb = hexToRgb(field.state.value);

                if (!rgb) return;

                field.handleChange(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
              } else {
                field.handleChange(rgbToHex(field.state.value));
              }
            }}
          >
            <SelectTrigger className="w-[120px] border-2 border-secondary">
              <SelectValue placeholder={getTranslation(t, "common.fields.format")} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="hex">{getTranslation(t, "common.fields.hex")}</SelectItem>
              <SelectItem value="rgb">{getTranslation(t, "common.fields.rgb")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Input
          id={field.name}
          type="text"
          placeholder={placeholder}
          value={field.state.value || ""}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className="border-2 border-secondary"
        />
      </div>
    </FieldWrapper>
  );
}
