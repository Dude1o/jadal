// UserForm.tsx

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getTranslation, isValidPhone } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { ROLES, STATUSES } from "@/lib/constants";
import { useData } from "@/hooks/api/use-data";
import { userQueryOptions } from "@/api/query-options";
import { Spinner } from "@/components/ui/spinner";
import { useMemo } from "react";
import DynamicForm, {
  type FormRow,
  type FieldConfig,
} from "../../dynamic-form/dynamic-form";
import { useFormKey } from "@/hooks/use-form-key";
import type { User } from "@/types";

type UserRole = "debater" | "trainer" | "judge" | "admin";
type UserStatus = "active" | "suspended" | "banned";

interface UserFormValues {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  avatar: { url: string; name: string } | null;
  phone: string;
}

interface UserFormProps {
  defaultValues?: Partial<UserFormValues>;
  onSubmit?: (values: UserFormValues) => Promise<void> | void;
  onCancel?: () => void;
  user_id?: number;
}

export default function UserForm({
  defaultValues,
  onSubmit,
  onCancel,
  user_id,
}: UserFormProps) {
  const { data: user, isLoading } = useData(userQueryOptions(user_id!));
  const { t, i18n } = useTranslation();

  // Transform initial avatar_url to the shape expected by file uploader
  const initialAvatar = useMemo(() => {
    const url = user?.avatar_url ?? defaultValues?.avatar_url ?? "";
    if (url) {
      const name = url.split("/").pop() || "avatar";
      return { url, name };
    }
    return null;
  }, [user, defaultValues]);

  const formKey = useFormKey(user);

  const formDefaultValues: User = {
    name: user?.name ?? defaultValues?.name ?? "",
    email: user?.email ?? defaultValues?.email ?? "",
    role: (user?.role ?? defaultValues?.role ?? "debater") as UserRole,
    status: (user?.status ?? defaultValues?.status ?? "active") as UserStatus,
    avatar_url: initialAvatar?.url,
    phone: user?.phone ?? defaultValues?.phone ?? "",
  };

  // Define reusable field configs (can be moved outside if preferred)
  const nameField: FieldConfig<UserFormValues> = {
    name: "name",
    label: `${getTranslation(t, "users.form.fields.name")} *`,
    type: "text",
    validators: {
      onChange: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "users.validation.nameRequired")
          : value.trim().length < 2
            ? getTranslation(t, "users.validation.nameTooShort")
            : undefined,
    },
  };

  const emailField: FieldConfig<UserFormValues> = {
    name: "email",
    label: `${getTranslation(t, "users.form.fields.email")} *`,
    type: "email",
    validators: {
      onChange: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "users.validation.emailRequired")
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? getTranslation(t, "users.validation.invalidEmail")
            : undefined,
    },
  };

  const passwordField: FieldConfig<UserFormValues> = {
    name: "password",
    label: `${getTranslation(t, "users.form.fields.password")} *`,
    type: "password",
    validators: {
      onChange: ({ value }) => {
        const v = value?.trim();

        if (!v) {
          return getTranslation(t, "users.validation.passwordRequired");
        }

        if (v.length < 8) {
          return getTranslation(t, "users.validation.passwordTooShort");
        }

        return undefined;
      },
    },
  };

  const avatarField: FieldConfig<UserFormValues> = {
    name: "avatar",
    label: getTranslation(t, "users.form.fields.avatar") ?? getTranslation(t, "users.form.fields.avatar"),
    type: "file",
    accept: "image/*",
    initialUrl: initialAvatar?.url,
    initialName: initialAvatar?.name,
  };

  const phoneField: FieldConfig<UserFormValues> = {
    name: "phone",
    label: getTranslation(t, "users.form.fields.phone"),
    type: "tel",
    validators: {
      onChange: ({ value }) =>
        value && !isValidPhone(value)
          ? getTranslation(t, "users.validation.invalidPhone")
          : undefined,
    },
  };

  const roleField: FieldConfig<UserFormValues> = {
    name: "role",
    label: `${getTranslation(t, "users.form.fields.role")} *`,
    type: "select",
    options: () =>
      ROLES.map((r) => ({
        label: getTranslation(t, r.label),
        value: r.value,
      })),
    validators: {
      onSubmit: ({ value }) =>
        !value ? getTranslation(t, "users.validation.roleRequired") : undefined,
    },
  };

  const statusField: FieldConfig<UserFormValues> = {
    name: "status",
    label: `${getTranslation(t, "users.form.fields.status")} *`,
    type: "select",
    options: () =>
      STATUSES.map((s) => ({
        label: getTranslation(t, s.label),
        value: s.value,
      })),
    validators: {
      onSubmit: ({ value }) =>
        !value
          ? getTranslation(t, "users.validation.statusRequired")
          : undefined,
    },
  };

  // Define the layout rows for DynamicForm
  const formRows: FormRow<UserFormValues>[] = [
    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {getTranslation(t, "users.form.sections.identity")}
          </p>
          <Separator />
        </div>
      ),
    },
    {
      kind: "fields",
      columns: 2,
      fields: [nameField, emailField],
    },
    {
      kind: "fields",
      columns: 1,
      fields: user_id ? [] : [passwordField],
    },
    {
      kind: "fields",
      columns: 1,
      fields: [avatarField],
    },
    {
      kind: "fields",
      columns: 1,
      fields: [phoneField],
    },
    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {getTranslation(t, "users.form.sections.roleAndStatus")}
          </p>
          <Separator />
        </div>
      ),
    },
    {
      kind: "fields",
      columns: 2,
      fields: [roleField, statusField],
    },
  ];

  // Transform submitted values to match API expectations
  const handleSubmit = async (values: UserFormValues) => {
    let avatar_url = "";
    if (values.avatar) {
      if (values.avatar instanceof File) {
        // Replace with actual upload logic
        avatar_url = "await uploadFile(values.avatar)";
      } else if (typeof values.avatar === "object" && "url" in values.avatar) {
        avatar_url = values.avatar.url;
      }
    }
    const payload = {
      ...values,
      avatar_url,
    };
    await onSubmit?.(payload);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm bg-background/50">
          <Spinner />
        </div>
      )}
      <div className="flex flex-col gap-4" dir={i18n.dir()}>
        <DynamicForm
          key={formKey}
          rows={formRows}
          defaultValues={formDefaultValues}
          onSubmit={handleSubmit}
          formId="dynamic-form"
          showSubmitButton={false}
        />

        <div className="flex w-full items-center gap-3 pt-2">
          <Button
            type="submit"
            form="dynamic-form"
            className="flex-1 bg-accent hover:bg-accent/80"
          >
            {getTranslation(t, "common.actions.save")}
          </Button>
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
        </div>
      </div>
    </div>
  );
}
