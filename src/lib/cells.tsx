import type { CellContext } from "@tanstack/react-table";
import { removeFromEnd } from "./utils";
import { t } from "i18next";

const formatStyles: Record<number, string> = {
  100: "bg-blue-100 text-blue-700",
  200: "bg-green-100 text-green-700",
};

const userStatusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  suspended: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  banned: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

const statusStyles: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  live: "bg-green-100 text-green-700",
  random: "bg-yellow-400 text-orange-700",
  manaul: "bg-orange-400 text-yellow-700",
};

const roleStyles: Record<string, string> = {
  debater: "bg-blue-100 text-blue-700",
  trainer: "bg-green-100 text-green-700",
};

export const Cell = {
  // ✅ Format cell - safely handle undefined context
  Format: () => (context: CellContext<any, unknown>) => {
    try {
      const { row, column } = context;

      // ✅ Fallback to row.original if getValue fails
      const columnId = column?.id;
      let value = columnId
        ? row.getValue<number>(columnId)
        : (row.original as any).format;

      // ✅ If value is an object, return placeholder
      if (typeof value === "object" && value !== null) {
        return <span className="text-muted-foreground">—</span>;
      }

      if (value === undefined || value === null) {
        return <span className="text-muted-foreground">—</span>;
      }

      return (
        <span
          className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
            formatStyles[value] ?? "bg-orange-100 text-orange-700"
          }`}
        >
          {value}
        </span>
      );
    } catch (error) {
      console.error("Cell.Format error:", error);
      return <span className="text-muted-foreground">—</span>;
    }
  },

  // ✅ Status cell - safely handle undefined context
  Status:
    (tableType: "users" | "debates" | "teams") =>
    (context: CellContext<any, unknown>) => {
      try {
        const { row, column } = context;

        // ✅ Fallback to row.original if getValue fails
        const columnId = column?.id;
        let value = columnId
          ? row.getValue<string>(columnId)
          : (row.original as any).status;

        // ✅ If value is an object, return placeholder
        if (typeof value === "object" && value !== null) {
          return <span className="text-muted-foreground">—</span>;
        }

        if (value === undefined || value === null) {
          return <span className="text-muted-foreground">—</span>;
        }

        return (
          <span
            className={`px-2 py-1 rounded-md text-xs font-bold ${
              statusStyles[value] ?? "bg-orange-100 text-orange-700"
            }`}
          >
            {t(`${tableType}.statuses.${value}`)}
          </span>
        );
      } catch (error) {
        console.error("Cell.Status error:", error);
        return <span className="text-muted-foreground">—</span>;
      }
    },

  UserStatus: () => (context: CellContext<any, unknown>) => {
    try {
      const { row, column } = context;
      const columnId = column?.id;

      const value = columnId
        ? row.getValue<string>(columnId)
        : (row.original as any).status;

      if (value === undefined || value === null) {
        return <span className="text-muted-foreground">—</span>;
      }

      return (
        <span
          className={`px-2 py-1 rounded-md text-xs font-bold border ${
            userStatusStyles[value] ?? "bg-orange-100 text-orange-700"
          }`}
        >
          {t(`users.statuses.${value}`)}
        </span>
      );
    } catch (error) {
      console.error("Cell.UserStatus error:", error);
      return <span className="text-muted-foreground">—</span>;
    }
  },

  // ✅ Role cell - safely handle undefined context
  Role:
    (tableType: "users" | "debates" | "teams") =>
    (context: CellContext<any, unknown>) => {
      try {
        const { row, column } = context;

        // ✅ Fallback to row.original if getValue fails
        const columnId = column?.id;
        const value = columnId
          ? row.getValue<string>(columnId)
          : (row.original as any).role;

        if (value === undefined || value === null) {
          return <span className="text-muted-foreground">—</span>;
        }

        return (
          <span
            className={`px-2 py-1 rounded-md text-xs font-bold ${
              roleStyles[value] ?? "bg-orange-100 text-orange-700"
            }`}
          >
            {removeFromEnd(t(`${tableType}.roles.${value}`))}
          </span>
        );
      } catch (error) {
        console.error("Cell.Role error:", error);
        return <span className="text-muted-foreground">—</span>;
      }
    },

  // ✅ TeamType cell - safely handle undefined context
  TeamType: () => (context: CellContext<any, unknown>) => {
    try {
      const { row, column } = context;

      // ✅ Fallback to row.original if getValue fails
      const columnId = column?.id;
      const value = columnId
        ? row.getValue<string>(columnId)
        : (row.original as any).type;

      if (value === undefined || value === null) {
        return <span className="text-muted-foreground">—</span>;
      }

      return (
        <span
          className={`px-2 py-1 rounded-md text-xs font-bold ${
            roleStyles[value] ?? "bg-orange-100 text-orange-700"
          }`}
        >
          {t(`teams.form.${value}`)}
        </span>
      );
    } catch (error) {
      console.error("Cell.TeamType error:", error);
      return <span className="text-muted-foreground">—</span>;
    }
  },

  // ✅ User/Avatar cell - for displaying user with avatar
  User: () => (context: CellContext<any, unknown>) => {
    try {
      const { row, column } = context;
      const columnId = column?.id;

      let user = columnId
        ? row.getValue<any>(columnId)
        : (row.original as any).created_by;

      if (!user || typeof user !== "object") {
        return <span className="text-muted-foreground">—</span>;
      }

      return (
        <div className="flex items-center gap-2">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
              {user.name?.[0] ?? "?"}
            </div>
          )}
          <span className="text-sm font-medium">
            {user.name || t("common.labels.unknown")}
          </span>
        </div>
      );
    } catch (error) {
      console.error("Cell.User error:", error);
      return <span className="text-muted-foreground">—</span>;
    }
  },

  // ✅ Count cell - for arrays (participants, phases, feedbacks)
  Count:
    (singular: string, plural: string) =>
    (context: CellContext<any, unknown>) => {
      try {
        const { row, column } = context;
        const columnId = column?.id;

        let items = columnId
          ? row.getValue<any[]>(columnId)
          : (row.original as any).items;

        const count = Array.isArray(items) ? items.length : 0;
        const label = count === 1 ? singular : plural;

        return (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{count}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        );
      } catch (error) {
        console.error("Cell.Count error:", error);
        return <span className="text-muted-foreground">—</span>;
      }
    },

  // ✅ Date cell - for date formatting
  Date: () => (context: CellContext<any, unknown>) => {
    try {
      const { row, column } = context;
      const columnId = column?.id;

      let value = columnId
        ? row.getValue<string>(columnId)
        : (row.original as any).date;

      if (!value) {
        return <span className="text-muted-foreground text-sm">—</span>;
      }

      return (
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      );
    } catch (error) {
      console.error("Cell.Date error:", error);
      return <span className="text-muted-foreground">—</span>;
    }
  },

  // ✅ DateTime cell - for date and time formatting
  DateTime: () => (context: CellContext<any, unknown>) => {
    try {
      const { row, column } = context;
      const columnId = column?.id;

      let value = columnId
        ? row.getValue<string>(columnId)
        : (row.original as any).datetime;

      if (!value) {
        return <span className="text-muted-foreground text-sm">—</span>;
      }

      const date = new Date(value);
      return (
        <span className="text-sm">
          {date.toLocaleDateString()}{" "}
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      );
    } catch (error) {
      console.error("Cell.DateTime error:", error);
      return <span className="text-muted-foreground">—</span>;
    }
  },

  // ✅ DebateResult cell - for debate results
  DebateResult: () => (context: CellContext<any, unknown>) => {
    try {
      const { row, column } = context;
      const columnId = column?.id;

      let result = columnId
        ? row.getValue<any>(columnId)
        : (row.original as any).result;

      if (!result) {
        return (
          <span className="text-muted-foreground text-sm">
            {t("debates.result.noResult")}
          </span>
        );
      }

      const winningSide = result.winning_side;
      const badgeColor =
        winningSide === "draw"
          ? "bg-yellow-100 text-yellow-700"
          : winningSide === "proposition"
            ? "bg-blue-100 text-blue-700"
            : "bg-purple-100 text-purple-700";

      const label =
        winningSide === "draw"
          ? t("debates.result.draw")
          : winningSide === "proposition"
            ? t("debates.result.propWins")
            : t("debates.result.oppWins");

      return (
        <span className={`px-2 py-1 rounded text-xs font-bold ${badgeColor}`}>
          {label}
        </span>
      );
    } catch (error) {
      console.error("Cell.DebateResult error:", error);
      return <span className="text-muted-foreground">—</span>;
    }
  },

  // ✅ Link cell - for recording_url and external links
  Link:
    (labelText: string = t("common.actions.view")) =>
    (context: CellContext<any, unknown>) => {
      try {
        const { row, column } = context;
        const columnId = column?.id;

        let url = columnId
          ? row.getValue<string>(columnId)
          : (row.original as any).url;

        if (!url) {
          return <span className="text-muted-foreground text-sm">—</span>;
        }

        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            {labelText}
          </a>
        );
      } catch (error) {
        console.error("Cell.Link error:", error);
        return <span className="text-muted-foreground">—</span>;
      }
    },

  // ✅ Motion cell - for motion text with truncation
  Motion: () => (context: CellContext<any, unknown>) => {
    try {
      const { row, column } = context;
      const columnId = column?.id;

      let motion = columnId
        ? row.getValue<any>(columnId)
        : (row.original as any).motion;

      const text = motion?.text || motion;

      if (!text) {
        return <span className="text-muted-foreground">—</span>;
      }

      return (
        <span className="font-medium line-clamp-2 text-sm" title={text}>
          {removeFromEnd(text.substring(0, 80))}
          {text.length > 80 ? "..." : ""}
        </span>
      );
    } catch (error) {
      console.error("Cell.Motion error:", error);
      return <span className="text-muted-foreground">—</span>;
    }
  },
};
