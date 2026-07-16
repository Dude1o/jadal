import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useFieldContext } from "./form-context";
import {
  cn,
  formatBytes,
  getFileIcon,
  getTranslation,
  isImage as checkIsImage,
} from "@/lib/utils";

import {
  CheckCircle2,
  FileText,
  UploadCloud,
  X,
  AlertCircle,
} from "lucide-react";

import { FieldWrapper } from "./field-wrapper";
import { Button } from "../button";

export interface UploadedFile {
  file: File;
  previewUrl?: string;
}

interface FileUploadFieldProps {
  label: string;
  accept?: string;
  maxSizeMb?: number;
  initialUrl?: string;
  initialName?: string;
}

export function FileUploaderField({
  label,
  accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt",
  maxSizeMb = 10,
  initialUrl,
  initialName,
}: FileUploadFieldProps) {
  const { t } = useTranslation();

  const [preview, setPreview] = useState<string | null>(initialUrl || null);

  const field = useFieldContext<UploadedFile | null>();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);

  const [userClearedExisting, setUserClearedExisting] = useState(false);

  useEffect(() => {
    const currentFile = field.state.value?.file;

    if (currentFile && checkIsImage(currentFile)) {
      const url = URL.createObjectURL(currentFile);

      setPreview(url);

      return () => URL.revokeObjectURL(url);
    } else if (!currentFile && !userClearedExisting && initialUrl) {
      setPreview(initialUrl);
    } else {
      setPreview(null);
    }
  }, [field.state.value, initialUrl, userClearedExisting]);

  const handleFile = (file: File) => {
    if (file.size > maxSizeMb * 1024 * 1024) {
      setLocalError(
        getTranslation(t, "common.fileUpload.errors.fileTooLarge", {
          size: maxSizeMb,
        }),
      );

      return;
    }

    setLocalError(null);

    setUserClearedExisting(true);

    field.handleChange({ file });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();

    setLocalError(null);

    setUserClearedExisting(true);

    field.handleChange(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const current = field.state.value;

  const isExisting = !current && !userClearedExisting && !!initialUrl;

  const hasFile = !!current || isExisting;

  return (
    <FieldWrapper
      label={label}
      errors={[...field.state.meta.errors, ...(localError ? [localError] : [])]}
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();

          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();

          setIsDragging(false);

          const file = e.dataTransfer.files?.[0];

          if (file) {
            handleFile(file);
          }
        }}
        onClick={() => !hasFile && fileInputRef.current?.click()}
        className={cn(
          "relative w-full rounded-xl border-2 border-dashed transition-all duration-200",
          "flex flex-col items-center justify-center min-h-[160px] p-4",
          !hasFile
            ? "cursor-pointer bg-muted/5 hover:bg-muted/10 border-muted-foreground/20 hover:border-primary/50"
            : "bg-background border-border",
          isDragging && "border-primary bg-primary/5 scale-[1.01]",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              handleFile(file);
            }
          }}
        />

        {hasFile ? (
          <div className="flex items-center gap-4 w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="relative shrink-0">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-20 h-20 rounded-lg object-cover border border-border shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center border border-border">
                  {current ? (
                    (() => {
                      const Icon = getFileIcon(current.file);

                      return <Icon className="w-8 h-8 text-muted-foreground" />;
                    })()
                  ) : (
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">
                {current?.file?.name ||
                  initialName ||
                  getTranslation(t, "common.fileUpload.status.uploadedFile")}
              </p>

              <p className="text-xs text-muted-foreground tabular-nums">
                {current
                  ? formatBytes(current.file?.size)
                  : getTranslation(t, "common.fileUpload.status.existingFile")}
              </p>

              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />

                <span className="text-[11px] uppercase tracking-wider font-bold text-success">
                  {current
                    ? getTranslation(t, "common.fileUpload.status.ready")
                    : getTranslation(t, "common.fileUpload.status.preserved")}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                isDragging
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary",
              )}
            >
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-medium">
                {isDragging
                  ? getTranslation(t, "common.fileUpload.dropzone.dropToUpload")
                  : getTranslation(t, "common.fileUpload.dropzone.clickOrDrag")}
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                {getTranslation(t, "common.fileUpload.dropzone.maximumSize")}{" "}
                <span className="font-medium text-foreground">
                  {maxSizeMb}MB
                </span>
              </p>
            </div>
          </div>
        )}

        {localError && (
          <div className="absolute -bottom-6 left-0 flex items-center gap-1.5 text-destructive animate-in slide-in-from-top-1">
            <AlertCircle className="w-3.5 h-3.5" />

            <span className="text-xs font-medium">{localError}</span>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
