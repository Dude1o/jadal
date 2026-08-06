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
import AppHeader from "@/components/common/app-header";

interface Props {
  complaints: Complaint[];
}

export default function ComplaintList({ complaints }: Props) {
  const { t } = useTranslation();

  const { mutateAsync: dismissComplaint } = useUpdate({
    mutationOptions: dismissComplaintMutationOptions(),
    queryKey: complaintKeys.all,
    successMessage: getTranslation(t, "complaints.messages.dismissed"),
    errorMessage: getTranslation(t, "complaints.messages.dismissError"),
  });

  const { mutateAsync: resolveComplaint } = useUpdate({
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

  const open = complaints.filter((c) => c.status === "open").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AppHeader
        title={getTranslation(t, "complaints.title")}
        entity="complaints"
        showCreateButton={false}
        meta={[
          {
            label: getTranslation(t, "complaints.title"),
            value: complaints.length,
          },
          { label: getTranslation(t, "complaints.statuses.open"), value: open },
        ]}
      />

      {/* §22.1 Two per row from 1180px. v2 specified a single-column list;
          v3 supersedes that — one per row read as too heavy. */}
      <div className="grid grid-cols-1 gap-6 min-[1180px]:grid-cols-2">
        {complaints.map((complaint, i) => (
          <div
            key={complaint.id}
            style={{ "--jd-i": i } as React.CSSProperties}
          >
            <ComplaintCard
              complaint={complaint}
              onDismiss={handleOnDismiss}
              onResolve={handleOnResolve}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
