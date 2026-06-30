export function FieldError({ errors }: { errors: unknown[] }) {
  const msg = errors
    .map((e) => (typeof e === "string" ? e : (e as any)?.message))
    .filter(Boolean)[0];
  if (!msg) return null;
  return <p className="text-sm font-bold text-destructive">{msg}</p>;
}
