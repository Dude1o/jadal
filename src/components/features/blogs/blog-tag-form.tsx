// components/features/blogs/blog-tag-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import DynamicForm, {
  type FormRow,
  type FieldConfig,
} from "../../dynamic-form/dynamic-form";
import { useFormKey } from "@/hooks/use-form-key";
import type { BlogTag } from "@/types";

interface BlogTagFormValues {
  name: string;
  slug: string;
}

interface BlogTagFormProps {
  tag?: BlogTag;
  onSubmit?: (values: BlogTagFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export default function BlogTagForm({
  tag,
  onSubmit,
  onCancel,
}: BlogTagFormProps) {
  const { t, i18n } = useTranslation();

  const formKey = useFormKey(tag);

  const formDefaultValues: BlogTagFormValues = {
    name: tag?.name ?? "",
    slug: tag?.slug ?? "",
  };

  const nameField: FieldConfig<BlogTagFormValues> = {
    name: "name",
    label: getTranslation(t, "blogs.form.fields.tagName"),
    type: "text",
    validators: {
      onChange: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "blogs.validation.tag.nameRequired")
          : value.trim().length < 2
            ? getTranslation(t, "blogs.validation.tag.nameTooShort")
            : undefined,
    },
  };

  const slugField: FieldConfig<BlogTagFormValues> = {
    name: "slug",
    label: getTranslation(t, "blogs.form.fields.slug"),
    type: "text",
    placeholder: getTranslation(t, "blogs.form.fields.slugPlaceholder"),
    validators: {
      onChange: ({ value }) =>
        value && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
          ? getTranslation(t, "blogs.validation.tag.invalidSlug")
          : undefined,
    },
  };

  const formRows: FormRow<BlogTagFormValues>[] = [
    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {getTranslation(t, "blogs.form.sections.tag")}
          </p>
          <Separator />
        </div>
      ),
    },
    {
      kind: "fields",
      columns: 1,
      fields: [nameField],
    },
    {
      kind: "fields",
      columns: 1,
      fields: [slugField],
    },
  ];

  const handleSubmit = async (values: BlogTagFormValues) => {
    const finalValues = {
      ...values,
      slug: values.slug.trim()
        ? values.slug.trim()
        : values.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
    };
    await onSubmit?.(finalValues);
  };

  return (
    <div className="flex flex-col gap-4" dir={i18n.dir()}>
      <DynamicForm
        key={formKey}
        rows={formRows}
        defaultValues={formDefaultValues}
        onSubmit={handleSubmit}
        formId="blog-tag-form"
        showSubmitButton={false}
      />

      <div className="flex w-full items-center gap-3 pt-2">
        <Button
          type="submit"
          form="blog-tag-form"
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
  );
}
