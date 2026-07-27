import { useSpinnerStore } from "@/store/use-spinner-store";
import { Spinner } from "@/components/ui/spinner";

export function GlobalSpinner() {
  const isLoading = useSpinnerStore((s) => s.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-none">
      <div className="rounded-full bg-background/90 p-4 shadow-lg pointer-events-auto">
        <Spinner className="h-8 w-8" />
      </div>
    </div>
  );
}
