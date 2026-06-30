// components/features/blogs/blog-category-form.tsx
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import DynamicForm, {
  type FormRow,
  type FieldConfig,
} from "../../dynamic-form/dynamic-form";
import { useFormKey } from "@/hooks/use-form-key";
import type { BlogCategory } from "@/types";

interface BlogCategoryFormValues {
  name: string;
  slug: string;
}

interface BlogCategoryFormProps {
  category?: BlogCategory;
  onSubmit?: (values: BlogCategoryFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export default function BlogCategoryForm({
  category,
  onSubmit,
  onCancel,
}: BlogCategoryFormProps) {
  const { t, i18n } = useTranslation();

  const formDefaultValues: BlogCategoryFormValues = {
    name: category?.name ?? "",
    slug: category?.slug ?? "",
  };

  const nameField: FieldConfig<BlogCategoryFormValues> = {
    name: "name",
    label: getTranslation(t, "blogs.form.fields.categoryName"),
    type: "text",
    validators: {
      onChange: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "blogs.validation.category.nameRequired")
          : value.trim().length < 2
            ? getTranslation(t, "blogs.validation.category.nameTooShort")
            : undefined,
    },
  };

  const slugField: FieldConfig<BlogCategoryFormValues> = {
    name: "slug",
    label: getTranslation(t, "blogs.form.fields.slug"),
    type: "text",
    validators: {
      onChange: ({ value }) =>
        value && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
          ? getTranslation(t, "blogs.validation.category.invalidSlug")
          : undefined,
    },
  };

  const formRows: FormRow<BlogCategoryFormValues>[] = [
    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {getTranslation(t, "blogs.form.sections.category")}
          </p>
          <Separator />
        </div>
      ),
    },
    { kind: "fields", columns: 1, fields: [nameField] },
    { kind: "fields", columns: 1, fields: [slugField] },
  ];

  const handleSubmit = async (values: BlogCategoryFormValues) => {
    const finalValues = {
      ...values,
      slug:
        values.slug.trim() ||
        values.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
    };
    await onSubmit?.(finalValues);
  };

  return (
    <div className="flex flex-col gap-4" dir={i18n.dir()}>
      <DynamicForm
        rows={formRows}
        defaultValues={formDefaultValues}
        onSubmit={handleSubmit}
        showSubmitButton={false}
      />

      <div className="flex gap-3">
        <Button type="submit" form="blog-category-form" className="flex-1">
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
