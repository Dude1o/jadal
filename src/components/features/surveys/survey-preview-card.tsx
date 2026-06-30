import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getNumber, getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { SurveyQuestion } from "@/types";

interface SurveyPreviewCardProps {
  title?: string;
  questions?: SurveyQuestion[];
}

export default function SurveyPreviewCard({
  title,
  questions = [],
}: SurveyPreviewCardProps) {
  const { t, i18n } = useTranslation();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{getTranslation(t, "surveys.actions.preview")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">
            {title || getTranslation(t, "surveys.labels.untitledSurvey")}
          </h2>
        </div>

        <div className="space-y-6">
          {questions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {getTranslation(t, "surveys.questions.noQuestionsAdded")}
            </p>
          )}

          {questions.map((question, index) => (
            <div
              key={question.id ?? index}
              className="space-y-3 border rounded-lg p-4"
            >
              <Label className="font-semibold">
                {index + 1}.{" "}
                {question.question_text ||
                  getTranslation(t, "surveys.questions.untitled")}
              </Label>

              {question.type === "mcq" && (
                <RadioGroup disabled dir={i18n.dir()}>
                  {question.options?.map((option, optIndex) => {
                    const id = `preview-${index}-${optIndex}`;
                    return (
                      <div key={optIndex} className="flex items-center gap-3">
                        <RadioGroupItem value={id} id={id} />
                        <Label htmlFor={id}>
                          {option ||
                            `${getTranslation(t, "surveys.options.single")} ${getNumber(optIndex + 1)}`}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}

              {question.type === "open_text" && (
                <Input
                  disabled
                  placeholder={getTranslation(t, "surveys.options.textAnswer")}
                />
              )}

              {question.type === "rating" && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled
                    >
                      {star}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
