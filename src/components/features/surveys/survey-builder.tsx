// src/components/SurveyBuilder.tsx

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { getError, getNumber, getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { Survey, SurveyQuestion } from "@/types";
import SurveyPreviewCard from "./survey-preview-card";
import { useCreate } from "@/hooks/api/use-create";
import { createSurveyMutationOptions } from "@/api/mutation-options";
import { ROLES, surveyKeys } from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

type NewSurveyQuestion = Omit<SurveyQuestion, "id" | "survey_id">;

type SurveyFormValues = Omit<
  Survey,
  "id" | "created_by" | "created_at" | "updated_at"
> & {
  questions: NewSurveyQuestion[];
};

export default function SurveyBuilder() {
  const { t, i18n } = useTranslation();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const { mutate: createSurvey } = useCreate({
    mutationOptions: createSurveyMutationOptions(),
    queryKey: surveyKeys.list(),
    successMessage: getTranslation(t, "surveys.messages.created"),
    errorMessage: getTranslation(t, "surveys.messages.createError"),
  });

  const form = useForm({
    defaultValues: {
      title: "",
      description: null,
      target_roles: [],
      closes_at: null,
      questions: [
        {
          type: "mcq",
          question_text: "",
          options: ["", ""],
          order_index: 0,
        },
      ] as NewSurveyQuestion[],
    } satisfies SurveyFormValues,
    onSubmit: async ({ value }) => {
      await form.validateAllFields("submit"); // Keep this for safety
      console.log("Survey definition:", value);
      await createSurvey(value);
      // form.reset();  // Maybe comment this for now during testing
    },
  });

  return (
    <div className="flex flex-col gap-2 xl:flex-row m-5">
      {/* BUILDER */}
      <Card className="w-full xl:w-[55%] mx-0 xl:mx-3">
        <CardHeader>
          <CardTitle>{getTranslation(t, "surveys.actions.addSurvey")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <form.Field
              name="questions"
              mode="array"
              validators={{
                onChange: ({ value }) =>
                  value.length < 1
                    ? getTranslation(t, "surveys.validation.minQuestions")
                    : undefined,
                onSubmit: ({ value }) =>
                  value.length < 1
                    ? getTranslation(t, "surveys.validation.minQuestions")
                    : undefined,
              }}
              validateOnMount={true}
            >
              {(field) => (
                <div className="space-y-6">
                  {/* TITLE */}
                  <form.Field
                    name="title"
                    validators={{
                      onChange: ({ value }) =>
                        !value.trim()
                          ? getTranslation(t, "surveys.validation.titleRequired")
                          : undefined,
                      onSubmit: ({ value }) =>
                        !value.trim()
                          ? getTranslation(t, "surveys.validation.titleRequired")
                          : undefined,
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label>
                          {getTranslation(t, "surveys.form.fields.title")} *
                        </Label>

                        <Input
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={getTranslation(t, "surveys.form.titlePlaceholder")}
                        />

                        {getError(field.state.meta.errors) && (
                          <p className="text-sm text-destructive font-medium">
                            ⚠ {getError(field.state.meta.errors)}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                  <form.Field name="description">
                    {(field) => (
                      <div className="space-y-2">
                        <Label>
                          {getTranslation(t, "surveys.form.fields.description")}
                        </Label>

                        <Input
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={getTranslation(t, "surveys.form.descriptionPlaceholder")}
                        />

                        {getError(field.state.meta.errors) && (
                          <p className="text-sm text-destructive font-medium">
                            ⚠ {getError(field.state.meta.errors)}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field
                    name="closes_at"
                    validators={{
                      onChange: ({ value }) =>
                        value && new Date(value) < new Date()
                          ? getTranslation(
                              t,
                              "surveys.validation.closesAtInvalid",
                            )
                          : undefined,
                      onSubmit: ({ value }) =>
                        value && new Date(value) < new Date()
                          ? getTranslation(
                              t,
                              "surveys.validation.closesAtInvalid",
                            )
                          : undefined,
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label>{getTranslation(t, "surveys.form.fields.closesAt")}</Label>

                        <Popover
                          open={isDatePickerOpen}
                          onOpenChange={setIsDatePickerOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${
                                !field.state.value && "text-muted-foreground"
                              }`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.state.value
                                ? format(new Date(field.state.value), "PPP")
                                : getTranslation(t, "common.labels.pickDate")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.state.value
                                  ? new Date(field.state.value)
                                  : undefined
                              }
                              onSelect={(date) => {
                                field.handleChange(
                                  date ? date.toISOString() : null,
                                );
                                setIsDatePickerOpen(false);
                              }}
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>

                        {getError(field.state.meta.errors) && (
                          <p className="text-sm text-destructive font-medium">
                            ⚠ {getError(field.state.meta.errors)}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  {/* QUESTIONS */}
                  {field.state.value.map((question, index) => (
                    <Card key={index} className="border-4 p-5">
                      <Label>
                        {`${getTranslation(t, "surveys.questions.single")} ${getNumber(index + 1)} (`}
                        {question.type === "open_text"
                          ? getTranslation(t, "surveys.questions.types.text")
                          : question.type === "rating"
                            ? getTranslation(t, "surveys.questions.types.rating")
                            : getTranslation(t, "surveys.questions.types.select")}
                        {")"}
                      </Label>

                      <CardContent className="space-y-4 pt-6">
                        {/* QUESTION TEXT */}
                        <form.Field
                          name={`questions[${index}].question_text`}
                          validators={{
                            onChange: ({ value }) =>
                              !value?.trim()
                                ? getTranslation(
                                    t,
                                    "surveys.validation.labelRequired",
                                  )
                                : undefined,
                            onBlur: ({ value }) =>
                              !value?.trim()
                                ? getTranslation(
                                    t,
                                    "surveys.validation.labelRequired",
                                  )
                                : undefined,
                            onSubmit: ({ value }) =>
                              !value?.trim()
                                ? getTranslation(
                                    t,
                                    "surveys.validation.labelRequired",
                                  )
                                : undefined,
                          }}
                        >
                          {(subField) => (
                            <div className="space-y-2">
                              <Label>
                                {getTranslation(t, "surveys.options.selectLabel")} *
                              </Label>

                              <Input
                                value={subField.state.value || ""}
                                onBlur={subField.handleBlur}
                                onChange={(e) => {
                                  subField.handleChange(e.target.value);
                                  // Force validation
                                  subField.validate("change");
                                }}
                                placeholder={getTranslation(t, "surveys.form.questionTextPlaceholder")}
                                className="border-3"
                              />

                              {/* Improved error display */}
                              {subField.state.meta.errors &&
                                subField.state.meta.errors.length > 0 && (
                                  <p className="text-sm text-destructive font-medium">
                                    ⚠ {getError(subField.state.meta.errors)}
                                  </p>
                                )}
                            </div>
                          )}
                        </form.Field>
                        {/* OPTIONS (ONLY FOR MCQ) */}
                        {question.type === "mcq" && (
                          <form.Field
                            name={`questions[${index}].options`}
                            mode="array"
                            validators={{
                              onChange: ({ value }) =>
                                !value || value.length < 2
                                  ? getTranslation(
                                      t,
                                      "surveys.validation.minOptions",
                                    )
                                  : undefined,
                              onSubmit: ({ value }) =>
                                !value || value.length < 2
                                  ? getTranslation(
                                      t,
                                      "surveys.validation.minOptions",
                                    )
                                  : undefined,
                            }}
                          >
                            {(optionsField) => (
                              <div className="space-y-3">
                                <Label>
                                  {getTranslation(t, "surveys.options.plural")} *
                                </Label>

                                {(optionsField.state.value ?? []).map(
                                  (_, optIndex) => (
                                    <form.Field
                                      key={optIndex}
                                      name={`questions[${index}].options[${optIndex}]`}
                                      validators={{
                                        onChange: ({ value }) =>
                                          !value?.trim()
                                ? getTranslation(
                                    t,
                                    "surveys.validation.optionRequired",
                                  )
                                            : undefined,
                                        onBlur: ({ value }) =>
                                          !value?.trim()
                                ? getTranslation(
                                    t,
                                    "surveys.validation.optionRequired",
                                  )
                                            : undefined,
                                        onSubmit: ({ value }) =>
                                          !value?.trim()
                                ? getTranslation(
                                    t,
                                    "surveys.validation.optionRequired",
                                  )
                                            : undefined,
                                      }}
                                    >
                                      {(optionField) => (
                                        <div className="flex flex-col sm:flex-row gap-2">
                                          <div className="flex-1">
                                            <Input
                                              value={
                                                optionField.state.value || ""
                                              }
                                              onBlur={optionField.handleBlur}
                                              onChange={(e) => {
                                                optionField.handleChange(
                                                  e.target.value,
                                                );
                                                optionField.validate("change");
                                                optionsField.validate("change"); // Revalidate parent
                                              }}
                                              placeholder={`${getTranslation(t, "surveys.options.single")} ${getNumber(optIndex + 1)}`}
                                              className="border-3"
                                            />

                                            {optionField.state.meta.errors
                                              ?.length > 0 && (
                                              <p className="text-sm text-destructive font-medium mt-1">
                                                ⚠{" "}
                                                {getError(
                                                  optionField.state.meta.errors,
                                                )}
                                              </p>
                                            )}
                                          </div>

                                          <Button
                                            type="button"
                                            variant="destructive"
                                            disabled={
                                              (optionsField.state.value ?? [])
                                                .length <= 2
                                            }
                                            onClick={() => {
                                              optionsField.removeValue(
                                                optIndex,
                                              );
                                              optionsField.validate("change");
                                            }}
                                          >
                                            {getTranslation(
                                              t,
                                              "surveys.questions.actions.removeOption",
                                            )}
                                          </Button>
                                        </div>
                                      )}
                                    </form.Field>
                                  ),
                                )}

                                {/* Options minimum error */}
                                {optionsField.state.meta.errors &&
                                  optionsField.state.meta.errors.length > 0 && (
                                    <p className="text-sm text-destructive font-medium bg-destructive/10 p-2 rounded border border-destructive/20">
                                      ⚠{" "}
                                      {getError(optionsField.state.meta.errors)}
                                    </p>
                                  )}

                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={() => optionsField.pushValue("")}
                                >
                                  {getTranslation(t, "surveys.questions.actions.addOption")}
                                </Button>
                              </div>
                            )}
                          </form.Field>
                        )}

                        <Button
                          type="button"
                          variant="destructive"
                          disabled={field.state.value.length <= 1} // ← Good UX
                          onClick={() => {
                            if (field.state.value.length > 1) {
                              field.removeValue(index);
                            }
                          }}
                        >
                          {getTranslation(t, "surveys.questions.actions.removeQuestion")}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}

                  {/* ADD QUESTION */}
                  {/* ADD QUESTION BUTTONS */}
                  <div className="flex flex-col gap-3 md:flex-row">
                    <Button
                      type="button"
                      onClick={() => {
                        field.pushValue({
                          type: "mcq",
                          question_text: "",
                          options: ["", ""],
                          order_index: field.state.value.length,
                        });
                      }}
                    >
                      {getTranslation(t, "surveys.questions.actions.addSelect")}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => {
                        field.pushValue({
                          type: "open_text",
                          question_text: "",
                          options: null,
                          order_index: field.state.value.length,
                        });
                      }}
                    >
                      {getTranslation(t, "surveys.questions.actions.addText")}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => {
                        field.pushValue({
                          type: "rating",
                          question_text: "",
                          options: null,
                          order_index: field.state.value.length,
                        });
                      }}
                    >
                      {getTranslation(t, "surveys.questions.actions.addRating")}
                    </Button>
                  </div>

                  {getError(field.state.meta.errors) && (
                    <p className="text-sm text-destructive font-medium">
                      ⚠ {getError(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="target_roles"
              mode="array"
              validators={{
                onChange: ({ value }) =>
                  value.length < 1
                    ? getTranslation(t, "surveys.validation.targetRolesRequired")
                    : undefined,
                onSubmit: ({ value }) =>
                  value.length < 1
                    ? getTranslation(t, "surveys.validation.targetRolesRequired")
                    : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label>{getTranslation(t, "surveys.form.fields.targetRoles")} *</Label>

                  <div className="space-y-3 border rounded-md p-4">
                    {ROLES.map((role) => (
                      <div key={role.value} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`role-${role.value}`}
                          checked={field.state.value.includes(role.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.pushValue(role.value);
                            } else {
                              const index = field.state.value.indexOf(
                                role.value,
                              );
                              if (index > -1) {
                                field.removeValue(index);
                              }
                            }
                            field.validate("change");
                          }}
                          className="w-4 h-4 rounded border-input cursor-pointer"
                        />
                        <label
                          htmlFor={`role-${role.value}`}
                          className="capitalize cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {role.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  {getError(field.state.meta.errors) && (
                    <p className="text-sm text-destructive font-medium">
                      ⚠ {getError(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* SUBMIT */}
            <div className="pt-4">
              <Button type="submit" className="bg-accent hover:bg-accent/80">
                {getTranslation(t, "surveys.actions.saveSurvey")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* PREVIEW */}
      <Card className="w-full xl:w-[45%]">
        <CardHeader>
          <CardTitle>{getTranslation(t, "surveys.actions.preview")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <form.Subscribe selector={(state) => state.values}>
            {(values) => (
              <>
                {/* Survey Info */}
                <div className="space-y-4 pb-6 border-b">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {values.title || getTranslation(t, "surveys.labels.noTitle")}
                    </h3>
                    {values.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {values.description}
                      </p>
                    )}
                  </div>

                  {values.closes_at && (
                    <div className="text-sm">
                      <span className="font-medium">
                        {getTranslation(t, "surveys.form.fields.closesAt")}:
                      </span>
                      <p className="text-muted-foreground">
                        {format(new Date(values.closes_at), "PPP p")}
                      </p>
                    </div>
                  )}

                  {values.target_roles && values.target_roles.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">
                        {getTranslation(t, "surveys.labels.targetRoles")}:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {values.target_roles.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs capitalize"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Questions Preview */}
                <div className="space-y-4">
                  <h4 className="font-semibold">
                    {getTranslation(t, "surveys.questions.plural")}
                  </h4>
                  <SurveyPreviewCard
                    title={values.title}
                    questions={values.questions as SurveyQuestion[]}
                  />
                </div>
              </>
            )}
          </form.Subscribe>
        </CardContent>
      </Card>
    </div>
  );
}
