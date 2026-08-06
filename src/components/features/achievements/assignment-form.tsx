"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { getTranslation } from "@/lib/utils";
import DynamicForm, {
  type FormRow,
  type FieldConfig,
} from "../../dynamic-form/dynamic-form";
import { usersQueryOptions } from "@/api/query-options";
import { userAvailableAchievementsQueryOptions } from "@/api/query-options";

interface AssignmentFormValues {
  user_id: string;
  achievement_id: string;
}

interface AssignmentFormProps {
  userId?: number;
  onAssign?: (userId: number, achievementId: number) => void;
  onCancel?: () => void;
}

export default function AssignmentForm({
  userId,
  onAssign,
  onCancel,
}: AssignmentFormProps) {
  const { t } = useTranslation();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    userId ?? null,
  );
  const showUserSelector = !userId;

  const formDefaultValues: AssignmentFormValues = {
    user_id: userId ? String(userId) : "",
    achievement_id: "",
  };

  const userIdField: FieldConfig<AssignmentFormValues> = {
    name: "user_id",
    label: `${getTranslation(t, "achievements.form.fields.user")} *`,
    type: "async-select",
    queryOptions: () => usersQueryOptions({ perPage: 200 }),
    getOptionLabel: (user: { name: string }) => user.name,
    getOptionValue: (user: { id: number }) => String(user.id),
    visible: () => showUserSelector,
    onChange: ({ value }) => {
      setSelectedUserId(value ? Number(value) : null);
    },
    validators: {
      onChange: ({ value }) =>
        !value
          ? getTranslation(t, "achievements.validation.userRequired")
          : undefined,
    },
  };

  const achievementIdField: FieldConfig<AssignmentFormValues> = {
    name: "achievement_id",
    label: `${getTranslation(t, "achievements.single")} *`,
    type: "async-select",
    queryOptions: () =>
      userAvailableAchievementsQueryOptions(selectedUserId ?? 0),
    getOptionLabel: (item: { name: string; type: string }) =>
      `${item.name} (${item.type})`,
    getOptionValue: (item: { id: number }) => String(item.id),
    validators: {
      onChange: ({ value }) =>
        !value
          ? getTranslation(t, "achievements.validation.typeRequired")
          : undefined,
    },
  };

  const formRows: FormRow<AssignmentFormValues>[] = [
    {
      kind: "fields",
      columns: 1,
      fields: [userIdField],
    },
    {
      kind: "fields",
      columns: 1,
      fields: [achievementIdField],
    },
  ];

  const handleSubmit = (values: AssignmentFormValues) => {
    const targetUserId = userId ?? Number(values.user_id);
    onAssign?.(targetUserId, Number(values.achievement_id));
  };

  return (
    <div>
      <DynamicForm<AssignmentFormValues>
        rows={formRows}
        defaultValues={formDefaultValues}
        onSubmit={handleSubmit}
        formId="assignment-form"
        showSubmitButton={false}
      />
      <div className="flex w-full items-center gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={onCancel}
          >
            {getTranslation(t, "common.actions.cancel")}
          </Button>
        )}
        <Button
          type="button"
          variant="accent"
          className="flex-1"
          onClick={() => {
            (
              document.getElementById("assignment-form") as HTMLFormElement
            )?.requestSubmit();
          }}
        >
          {getTranslation(t, "achievements.actions.assign")}
        </Button>
      </div>
    </div>
  );
}
