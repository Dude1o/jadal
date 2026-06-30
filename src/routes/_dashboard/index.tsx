import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";

export const Route = createFileRoute("/_dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-10">
      <div className="p-8">
        <h1>{getTranslation(t, "home.hello")}</h1>
      </div>
    </div>
  );
}
