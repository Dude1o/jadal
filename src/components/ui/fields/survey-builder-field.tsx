"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FieldWrapper } from "./field-wrapper";
import { useFieldContext } from "./form-context";
import {
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  AlertCircle,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from "lucide-react";

import type { SurveyQuestion } from "@/types";
import { getTranslation } from "@/lib/utils";

interface SurveyBuilderFieldProps {
  fieldName: string;
  label?: string;
  description?: string;
  maxQuestions?: number;
  minQuestions?: number;
}

interface ValidationError {
  questionId: number | string;
  field: "question_text" | "options";
  message: string;
}

export function SurveyBuilderField({
  fieldName,
  label,
  description,
  maxQuestions = 20,
  minQuestions = 1,
}: SurveyBuilderFieldProps) {
  const { t } = useTranslation();

  const surveyField = useFieldContext<SurveyQuestion[]>();
  const [expanded, setExpanded] = useState<Set<number | string>>(new Set());
  const [focusedQuestionId, setFocusedQuestionId] = useState<
    number | string | null
  >(null);

  const questions = Array.isArray(surveyField.state.value)
    ? surveyField.state.value
    : [];

  const validationErrors = useMemo((): ValidationError[] => {
    const errors: ValidationError[] = [];

    questions.forEach((q) => {
      if (!q.question_text?.trim()) {
        errors.push({
          questionId: q.id,
          field: "question_text",
          message: getTranslation(
            t,
            "surveyBuilder.validation.questionTextRequired",
          ),
        });
      }

      if (q.type === "mcq") {
        if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
          errors.push({
            questionId: q.id,
            field: "options",
            message: getTranslation(
              t,
              "surveyBuilder.validation.mcqAtLeastTwoOptions",
            ),
          });
        } else {
          const emptyCount = q.options.filter((opt) => !opt?.trim()).length;
          if (emptyCount > 0) {
            errors.push({
              questionId: q.id,
              field: "options",
              message: getTranslation(
                t,
                "surveyBuilder.validation.optionsCannotBeEmpty",
                {
                  plural: emptyCount > 1 ? "s" : "",
                },
              ),
            });
          }
        }
      }
    });

    if (questions.length < minQuestions) {
      errors.push({
        questionId: "",
        field: "question_text",
        message: getTranslation(
          t,
          "surveyBuilder.validation.atLeastQuestions",
          {
            count: minQuestions,
            plural: minQuestions > 1 ? "s" : "",
          },
        ),
      });
    }

    return errors;
  }, [questions, minQuestions, t]);

  const globalErrors = validationErrors.filter((e) => e.questionId === "");
  const getQuestionErrors = (questionId: number | string) =>
    validationErrors.filter((e) => e.questionId === questionId);

  const addQuestion = useCallback(
    (type: "mcq" | "open_text" | "rating") => {
      if (maxQuestions && questions.length >= maxQuestions) return;

      let options: any = null;
      if (type === "mcq")
        options = [
          getTranslation(t, "surveyBuilder.mcq.defaultOption", { n: 1 }),
          getTranslation(t, "surveyBuilder.mcq.defaultOption", { n: 2 }),
        ];
      if (type === "rating") options = { min: 1, max: 10, step: 1 };

      const newQuestion: SurveyQuestion = {
        id: Date.now(),
        question_text: "",
        type,
        options,
        order_index: questions.length + 1,
      };

      surveyField.handleChange([...questions, newQuestion]);
      setExpanded((prev) => new Set([...prev, newQuestion.id]));
      setFocusedQuestionId(newQuestion.id);
    },
    [questions, maxQuestions, surveyField, t],
  );

  const updateQuestion = useCallback(
    (id: number | string, updates: Partial<SurveyQuestion>) => {
      surveyField.handleChange(
        questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
      );
    },
    [questions, surveyField],
  );

  const removeQuestion = useCallback(
    (id: number | string) => {
      const updated = questions
        .filter((q) => q.id !== id)
        .map((q, i) => ({ ...q, order_index: i + 1 }));
      surveyField.handleChange(updated);
      setExpanded((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [questions, surveyField],
  );

  const duplicateQuestion = useCallback(
    (id: number | string) => {
      if (maxQuestions && questions.length >= maxQuestions) return;
      const original = questions.find((q) => q.id === id);
      if (!original) return;

      const copy: SurveyQuestion = {
        ...original,
        id: Date.now(),
        order_index: questions.length + 1,
      };

      surveyField.handleChange([...questions, copy]);
      setExpanded((prev) => new Set([...prev, copy.id]));
    },
    [questions, maxQuestions, surveyField],
  );

  const moveQuestion = useCallback(
    (id: number | string, direction: "up" | "down") => {
      const index = questions.findIndex((q) => q.id === id);
      if (index === -1) return;

      const newQuestions = [...questions];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newQuestions.length) return;

      [newQuestions[index], newQuestions[targetIndex]] = [
        newQuestions[targetIndex],
        newQuestions[index],
      ];

      newQuestions.forEach((q, i) => (q.order_index = i + 1));
      surveyField.handleChange(newQuestions);
    },
    [questions, surveyField],
  );

  const canAddMore = !maxQuestions || questions.length < maxQuestions;
  const canRemoveMore = questions.length > minQuestions;

  return (
    <FieldWrapper
      label={label || getTranslation(t, "surveyBuilder.label")}
      description={
        description || getTranslation(t, "surveyBuilder.description")
      }
      errors={surveyField.state.meta.errors}
    >
      <div className="space-y-6 max-w-4xl mx-auto dark text-slate-100">
        {globalErrors.length > 0 && (
          <div className="bg-red-950/40 backdrop-blur-sm border border-red-900/60 rounded-2xl p-4 flex gap-3 shadow-md shadow-red-950/50 transition-all">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm text-red-200">
                {getTranslation(t, "surveyBuilder.validation.formRequirements")}
              </h3>
              <ul className="text-xs text-red-400/90 mt-1 space-y-1 list-disc pl-4">
                {globalErrors.map((err, i) => (
                  <li key={i}>{err.message}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {questions.length === 0 ? (
          <Card className="p-16 border-2 border-dashed border-slate-800 bg-slate-900/20 flex flex-col items-center justify-center text-center rounded-2xl transition-all hover:bg-slate-900/40">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-md border border-slate-800 ring-4 ring-slate-900/50">
              <Sparkles className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-200 mb-1">
              {getTranslation(t, "surveyBuilder.emptyState.title")}
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mb-1">
              {getTranslation(t, "surveyBuilder.emptyState.description")}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                totalQuestions={questions.length}
                isExpanded={expanded.has(question.id)}
                isFocused={focusedQuestionId === question.id}
                errors={getQuestionErrors(question.id)}
                onToggle={() => {
                  setExpanded((prev) => {
                    const next = new Set(prev);
                    if (next.has(question.id)) next.delete(question.id);
                    else next.add(question.id);
                    return next;
                  });
                  setFocusedQuestionId(question.id);
                }}
                onUpdate={(updates) => updateQuestion(question.id, updates)}
                onRemove={() => removeQuestion(question.id)}
                onDuplicate={() => duplicateQuestion(question.id)}
                onMove={(dir) => moveQuestion(question.id, dir)}
                canRemove={canRemoveMore}
                canDuplicate={canAddMore}
                t={t}
              />
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-slate-800">
          <div className="flex flex-wrap gap-2.5">
            <Button
              type="button"
              onClick={() => addQuestion("mcq")}
              disabled={!canAddMore}
              variant="outline"
              className="bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 shadow-md rounded-xl h-10 px-4 transition-colors disabled:opacity-40"
            >
              <Plus className="mr-2 h-4 w-4 text-slate-400" />
              {getTranslation(t, "surveyBuilder.buttons.multipleChoice")}
            </Button>

            <Button
              type="button"
              onClick={() => addQuestion("open_text")}
              disabled={!canAddMore}
              variant="outline"
              className="bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 shadow-md rounded-xl h-10 px-4 transition-colors disabled:opacity-40"
            >
              <Plus className="mr-2 h-4 w-4 text-slate-400" />
              {getTranslation(t, "surveyBuilder.buttons.openText")}
            </Button>

            <Button
              type="button"
              onClick={() => addQuestion("rating")}
              disabled={!canAddMore}
              variant="outline"
              className="bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 shadow-md rounded-xl h-10 px-4 transition-colors disabled:opacity-40"
            >
              <Plus className="mr-2 h-4 w-4 text-slate-400" />
              {getTranslation(t, "surveyBuilder.buttons.ratingScale")}
            </Button>
          </div>

          {maxQuestions && (
            <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800/80 font-medium shadow-sm">
              {getTranslation(t, "surveyBuilder.counter", {
                current: questions.length,
                max: maxQuestions,
              })}
            </div>
          )}
        </div>
      </div>
    </FieldWrapper>
  );
}

/* ==================== Question Card ==================== */

interface QuestionCardProps {
  question: SurveyQuestion;
  index: number;
  totalQuestions: number;
  isExpanded: boolean;
  isFocused: boolean;
  errors: ValidationError[];
  onToggle: () => void;
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onMove: (direction: "up" | "down") => void;
  canRemove: boolean;
  canDuplicate: boolean;
  t: any;
}

function QuestionCard({
  question,
  index,
  totalQuestions,
  isExpanded,
  isFocused,
  errors,
  onToggle,
  onUpdate,
  onRemove,
  onDuplicate,
  onMove,
  canRemove,
  canDuplicate,
  t,
}: QuestionCardProps) {
  const hasErrors = errors.length > 0;

  return (
    <Card
      className={`overflow-hidden rounded-2xl transition-all duration-200 shadow-lg ${
        isFocused
          ? "ring-2 ring-indigo-500/50 border-indigo-500/40 bg-slate-900"
          : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
      } ${hasErrors ? "border-red-900/80 ring-2 ring-red-500/10" : ""}`}
    >
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer select-none group"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-slate-600">
            <GripVertical className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-x-1 group-hover:translate-x-0" />
            <span className="font-mono text-xs font-bold bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md text-slate-400 shadow-inner">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50 uppercase tracking-wider">
            {getTranslation(
              t,
              `surveyBuilder.questionCard.types.${question.type}`,
            )}
          </span>

          <div className="flex-1 truncate text-sm font-medium text-slate-300 group-hover:text-slate-100 transition-colors">
            {question.question_text ? (
              question.question_text
            ) : (
              <span className="text-slate-600 italic font-normal">
                {getTranslation(t, "surveyBuilder.questionCard.untitled")}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 ml-3">
          {hasErrors && (
            <div className="text-red-400 text-xs font-semibold flex items-center gap-1 bg-red-950/40 px-2.5 py-0.5 rounded-md border border-red-900/50">
              <AlertCircle className="w-3.5 h-3.5" />
              {getTranslation(t, "surveyBuilder.questionCard.issues")}
            </div>
          )}
          <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-950 border border-slate-800 text-slate-500 group-hover:text-slate-300 group-hover:bg-slate-800 transition-all">
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-5 pt-2 space-y-5 bg-slate-900 border-t border-slate-950">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-400 tracking-wide">
              {getTranslation(t, "surveyBuilder.questionCard.questionTitle")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              value={question.question_text}
              onChange={(e) => onUpdate({ question_text: e.target.value })}
              placeholder={getTranslation(
                t,
                "surveyBuilder.questionCard.placeholder",
              )}
              className={`text-sm rounded-xl h-11 transition-all ${
                errors.some((e) => e.field === "question_text")
                  ? "border-red-900 bg-red-950/20 text-red-200 focus-visible:ring-red-500"
                  : "border-slate-800 focus-visible:ring-indigo-500 bg-slate-950 text-slate-100 placeholder:text-slate-600"
              }`}
            />
            {errors
              .filter((e) => e.field === "question_text")
              .map((err, i) => (
                <p
                  key={i}
                  className="text-red-400 text-xs font-medium mt-1.5 flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> {err.message}
                </p>
              ))}
          </div>

          {question.type === "mcq" && Array.isArray(question.options) && (
            <MCQOptions
              options={question.options}
              onChange={(newOptions) => onUpdate({ options: newOptions })}
              errors={errors.filter((e) => e.field === "options")}
              t={t}
            />
          )}

          {question.type === "open_text" && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex gap-3 text-slate-400 shadow-inner">
              <div className="mt-0.5 text-xs bg-slate-800 text-slate-300 w-5 h-5 rounded-md font-mono flex items-center justify-center shrink-0">
                Aa
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  {getTranslation(t, "surveyBuilder.openText.title")}
                </p>
                <p className="text-xs mt-0.5 text-slate-500">
                  {getTranslation(t, "surveyBuilder.openText.description")}
                </p>
              </div>
            </div>
          )}

          {question.type === "rating" &&
            question.options &&
            typeof question.options === "object" && (
              <RatingConfig
                options={question.options}
                onChange={(newOptions) => onUpdate({ options: newOptions })}
                t={t}
              />
            )}

          <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-950">
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMove("up")}
                disabled={index === 0}
                className="h-8 w-8 p-0 text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-800 hover:bg-slate-950 rounded-lg disabled:opacity-30"
                title={getTranslation(t, "surveyBuilder.buttons.moveUp")}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMove("down")}
                disabled={index === totalQuestions - 1}
                className="h-8 w-8 p-0 text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-800 hover:bg-slate-950 rounded-lg disabled:opacity-30"
                title={getTranslation(t, "surveyBuilder.buttons.moveDown")}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <div className="h-4 w-px bg-slate-800 mx-1" />
              <Button
                variant="outline"
                size="sm"
                onClick={onDuplicate}
                disabled={!canDuplicate}
                className="h-8 border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg text-xs"
              >
                <Copy className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                {getTranslation(t, "surveyBuilder.buttons.duplicate")}
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              disabled={!canRemove}
              className="h-8 text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent hover:border-red-900/30 rounded-lg text-xs"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              {getTranslation(t, "surveyBuilder.buttons.deleteQuestion")}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ==================== MCQ Options ==================== */

function MCQOptions({
  options,
  onChange,
  errors,
  t,
}: {
  options: string[];
  onChange: (options: string[]) => void;
  errors: ValidationError[];
  t: any;
}) {
  const hasErrors = errors.length > 0;

  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold text-slate-400 tracking-wide">
        {getTranslation(t, "surveyBuilder.mcq.optionsSelection")}
      </Label>

      <div
        className={`space-y-2 p-4 rounded-xl border transition-colors ${
          hasErrors
            ? "border-red-900/50 bg-red-950/10"
            : "border-slate-950 bg-slate-950"
        }`}
      >
        {options.map((option, idx) => {
          const isEmpty = !option?.trim();

          return (
            <div key={idx} className="flex items-center gap-2.5 group">
              <div className="w-5 h-5 flex items-center justify-center rounded-full border border-slate-800 text-slate-500 bg-slate-900 shadow-inner text-[10px] font-mono shrink-0">
                {idx + 1}
              </div>

              <Input
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[idx] = e.target.value;
                  onChange(newOptions);
                }}
                className={`flex-1 bg-slate-900 h-9 text-sm rounded-lg border focus-visible:ring-indigo-500 shadow-sm text-slate-200 ${
                  isEmpty
                    ? "border-red-700 bg-red-950/30 focus-visible:ring-red-500"
                    : "border-slate-800"
                }`}
                placeholder={getTranslation(
                  t,
                  "surveyBuilder.mcq.optionPlaceholder",
                  { n: idx + 1 },
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (options.length > 2)
                    onChange(options.filter((_, i) => i !== idx));
                }}
                disabled={options.length <= 2}
                className="h-9 w-9 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-red-400 hover:bg-red-950/40 disabled:opacity-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {hasErrors && (
        <div className="text-red-400 text-xs font-medium space-y-1 mt-1">
          {errors.map((err, i) => (
            <p key={i} className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {err.message}
            </p>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange([
            ...options,
            getTranslation(t, "surveyBuilder.mcq.defaultOption", {
              n: options.length + 1,
            }),
          ])
        }
        className="w-full h-9 border-dashed border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 text-xs rounded-lg shadow-sm"
      >
        <Plus className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
        {getTranslation(t, "surveyBuilder.buttons.addChoiceOption")}
      </Button>
    </div>
  );
}

/* ==================== Rating Config ==================== */

function RatingConfig({
  options,
  onChange,
  t,
}: {
  options: { min: number; max: number; step: number };
  onChange: (options: { min: number; max: number; step: number }) => void;
  t: any;
}) {
  return (
    <div className="space-y-3.5">
      <Label className="text-xs font-semibold text-slate-400 tracking-wide">
        {getTranslation(t, "surveyBuilder.rating.title")}
      </Label>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label
            htmlFor="min"
            className="text-[11px] font-medium text-slate-500"
          >
            {getTranslation(t, "surveyBuilder.rating.minLimit")}
          </Label>
          <Input
            id="min"
            type="number"
            value={options.min}
            onChange={(e) =>
              onChange({ ...options, min: parseInt(e.target.value) || 1 })
            }
            className="h-10 text-sm rounded-lg border-slate-800 bg-slate-950 text-slate-200"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="max"
            className="text-[11px] font-medium text-slate-500"
          >
            {getTranslation(t, "surveyBuilder.rating.maxLimit")}
          </Label>
          <Input
            id="max"
            type="number"
            value={options.max}
            onChange={(e) =>
              onChange({ ...options, max: parseInt(e.target.value) || 10 })
            }
            className="h-10 text-sm rounded-lg border-slate-800 bg-slate-950 text-slate-200"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="step"
            className="text-[11px] font-medium text-slate-500"
          >
            {getTranslation(t, "surveyBuilder.rating.step")}
          </Label>
          <Input
            id="step"
            type="number"
            value={options.step}
            onChange={(e) =>
              onChange({ ...options, step: parseInt(e.target.value) || 1 })
            }
            className="h-10 text-sm rounded-lg border-slate-800 bg-slate-950 text-slate-200"
          />
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 text-center shadow-inner">
        <p
          className="text-xs font-medium text-slate-400 flex items-center justify-center gap-2 flex-wrap"
          dangerouslySetInnerHTML={{
            __html: getTranslation(t, "surveyBuilder.rating.livePreview", {
              min: options.min,
              max: options.max,
              step: options.step,
            }),
          }}
        />
      </div>
    </div>
  );
}
