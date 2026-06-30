import { z } from "zod";

const optionSchema = z.string().min(1, "Option cannot be empty");

const questionSchema = z.object({
  label: z.string().min(1, "Question label is required"),
  options: z.array(optionSchema).min(1, "At least one option is required"),
});

export const surveySchema = z.object({
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

export type SurveyFormValues = z.infer<typeof surveySchema>;
