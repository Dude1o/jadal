// fields/form-context.tsx
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { TextInputField } from "./text-input";
import { TextareaField } from "./text-area";
import { SelectField } from "./select";
import { AsyncSelectField } from "./async-select";
import { AsyncMultiSelectField } from "./async-multi-select";
import { CheckboxField } from "./checkbox";
import { SwitchField } from "./switch";
import { RadioGroupField } from "./radio-group";
import { SliderField } from "./slider";
import { DatePickerField } from "./date-picker";
import { MultiCheckboxField } from "./multi-checkbox";
import { FileUploaderField } from "./file-upload";
import { ArrayField } from "./array-field";
import { ColorField } from "./color-field";
import { SurveyBuilderField } from "./survey-builder-field";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextInputField,
    TextareaField,
    SelectField,
    AsyncSelectField,
    CheckboxField,
    SwitchField,
    RadioGroupField,
    SliderField,
    DatePickerField,
    MultiCheckboxField,
    FileUploaderField,
    ArrayField,
    ColorField,
    SurveyBuilderField,
    AsyncMultiSelectField,
  },
  formComponents: {},
});
