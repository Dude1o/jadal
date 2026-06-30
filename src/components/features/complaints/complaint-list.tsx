import type { Complaint } from "@/types";
import ComplaintCard from "@/components/features/complaints/complaint-card";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";
import { useUpdate } from "@/hooks/api/use-update";
import { complaintKeys } from "@/lib/constants";
import {
  dismissComplaintMutationOptions,
  resolveComplaintMutationOptions,
} from "@/api/mutation-options";

interface Props {
  complaints: Complaint[];
}

export default function ComplaintList({ complaints }: Props) {
  const { t } = useTranslation();

  const { mutateAsync: dismissComplaint, isPending: isDismissPending } =
    useUpdate({
      mutationOptions: dismissComplaintMutationOptions(),
      queryKey: complaintKeys.all,
      successMessage: getTranslation(t, "complaints.messages.dismissed"),
      errorMessage: getTranslation(t, "complaints.messages.dismissError"),
    });

  const { mutateAsync: resolveComplaint, isPending: isResolvePending } =
    useUpdate({
      mutationOptions: resolveComplaintMutationOptions(),
      queryKey: complaintKeys.all,
      successMessage: getTranslation(t, "complaints.messages.resolved"),
      errorMessage: getTranslation(t, "complaints.messages.resolvError"),
    });

  const handleOnDismiss = (id: number, admin_comment?: string) => {
    dismissComplaint({ id, admin_comment });
  };

  const handleOnResolve = (id: number, admin_comment?: string) => {
    resolveComplaint({ id, admin_comment });
  };

  return (
    <div className="min-h-screen py-6 px-6">
      <h1 className="text-3xl font-bold mb-12 text-primary">
        {getTranslation(t, "complaints.title")}
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {complaints.map((complaint) => (
          <ComplaintCard
            key={complaint.id}
            complaint={complaint}
            onDismiss={handleOnDismiss}
            onResolve={handleOnResolve}
          />
        ))}
      </div>
    </div>
  );
}
