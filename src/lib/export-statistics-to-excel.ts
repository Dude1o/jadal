import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Chart, registerables, type ChartConfiguration } from "chart.js";
import type { ExportableStat, ExcelStyleOptions, ChartOptions } from "@/types";
import { getTranslation, isRTL } from "./utils";
import type { TFunction } from "i18next";

Chart.register(...registerables);

/* ── helpers ─────────────────────────────────────────────────────── */
function toArgb(color: string): string {
  const c = color.replace(/^#/, "").toUpperCase();
  return c.length === 6 ? `FF${c}` : c;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const DEFAULT_STYLES: Required<ExcelStyleOptions> = {
  headerBgColor: "FF1F4E79",
  headerFontColor: "FFFFFFFF",
  headerFontSize: 12,
  headerFontName: "Calibri",
  rowBgColor: "FFFFFFFF",
  altRowBgColor: "FFF5F7FA",
  cellFontColor: "FF333333",
  cellFontSize: 11,
  cellFontName: "Calibri",
  valueFontBold: true,
  trendUpColor: "FF006600",
  trendDownColor: "FFCC0000",
  trendNeutralColor: "FF666666",
  badgeBgColor: "FFE8F0FE",
  badgeFontColor: "FF1A73E8",
};

/* ── Chart.js → PNG ──────────────────────────────────────────────── */
async function generateChartImage(
  stats: ExportableStat[],
  options: ChartOptions = {},
): Promise<string> {
  const {
    type = "bar",
    title = "Statistics Overview",
    width = 900,
    height = 480,
    backgroundColor = "#ffffff",
    colors = [
      "#4e79a7",
      "#f28e2b",
      "#e15759",
      "#76b7b2",
      "#59a14f",
      "#edc948",
      "#b07aa1",
      "#ff9da7",
    ],
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  const labels = stats.map((s) => String(s.label ?? "").slice(0, 40));
  const data = stats.map((s) =>
    typeof s.value === "number" ? s.value : parseFloat(String(s.value)) || 0,
  );

  const config: ChartConfiguration = {
    type,
    data: {
      labels,
      datasets: [
        {
          label: title,
          data,
          backgroundColor: type === "line" ? colors[0] : colors,
          borderColor: type === "line" ? colors[0] : colors,
          borderWidth: 2,
          tension: 0.3,
          fill: type === "line" ? false : undefined,
        },
      ],
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 18, weight: "bold" },
          color: "#222",
        },
        legend: { display: type === "pie" || type === "doughnut" },
      },
      scales:
        type === "pie" || type === "doughnut"
          ? undefined
          : {
              y: {
                beginAtZero: true,
                ticks: { color: "#555" },
                grid: { color: "#eee" },
              },
              x: {
                ticks: { color: "#555", maxRotation: 45 },
                grid: { display: false },
              },
            },
    },
  };

  const chart = new Chart(ctx, config);
  await new Promise((r) => setTimeout(r, 80));
  const dataUrl = canvas.toDataURL("image/png");
  chart.destroy();
  return dataUrl;
}

/* ── Main export ─────────────────────────────────────────────────── */
export async function exportStatisticsToExcel(
  stats: ExportableStat[],
  fileName: string = "statistics.xlsx",
  t: TFunction,
  styleOptions: ExcelStyleOptions = {},
  includeChart: boolean = true,
  chartOptions: ChartOptions = {},
): Promise<void> {
  if (!stats?.length) {
    console.warn("[ExcelJS] No stats to export");
    return;
  }

  const rtl = isRTL();

  const raw = { ...DEFAULT_STYLES, ...styleOptions };
  const styles: Required<ExcelStyleOptions> = {
    ...raw,
    headerBgColor: toArgb(raw.headerBgColor),
    headerFontColor: toArgb(raw.headerFontColor),
    rowBgColor: toArgb(raw.rowBgColor),
    altRowBgColor: toArgb(raw.altRowBgColor),
    cellFontColor: toArgb(raw.cellFontColor),
    trendUpColor: toArgb(raw.trendUpColor),
    trendDownColor: toArgb(raw.trendDownColor),
    trendNeutralColor: toArgb(raw.trendNeutralColor),
    badgeBgColor: toArgb(raw.badgeBgColor),
    badgeFontColor: toArgb(raw.badgeFontColor),
  };

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Statistics Export";
  workbook.created = new Date();

  const ws = workbook.addWorksheet("Statistics", {
    views: [
      {
        showGridLines: false,
        rightToLeft: rtl, // ← makes the whole sheet RTL in Excel
      },
    ],
  });

  // Column definitions (logical order: Label → … → Description)
  const columnDefs = [
    {
      header: getTranslation(t, "statistics.label"),
      key: "label",
      width: 32,
    },
    {
      header: getTranslation(t, "statistics.value"),
      key: "value",
      width: 12,
    },
    {
      header: getTranslation(t, "statistics.suffix"),
      key: "suffix",
      width: 10,
    },
    {
      header: getTranslation(t, "statistics.trend"),
      key: "trend",
      width: 12,
    },
    {
      header: getTranslation(t, "statistics.trendValue"),
      key: "trendValue",
      width: 18,
    },
    {
      header: getTranslation(t, "statistics.badge"),
      key: "badge",
      width: 14,
    },
    {
      header: getTranslation(t, "statistics.description"),
      key: "description",
      width: 42,
    },
  ];

  // In RTL we reverse the visual column order so Label appears on the right
  ws.columns = rtl ? [...columnDefs].reverse() : columnDefs;

  // Map logical key → actual column number after possible reverse
  const keyToCol: Record<string, number> = {};
  ws.columns.forEach((col, idx) => {
    if (col.key) keyToCol[col.key as string] = idx + 1;
  });

  // ── Header styling ──────────────────────────────────────────────
  const headerRow = ws.getRow(1);
  headerRow.height = 26;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: styles.headerBgColor },
    };
    cell.font = {
      name: styles.headerFontName,
      size: styles.headerFontSize,
      bold: true,
      color: { argb: styles.headerFontColor },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      readingOrder: rtl ? "rtl" : "ltr",
    };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FF000000" } },
    };
  });

  // ── Data rows ───────────────────────────────────────────────────
  stats.forEach((stat, index) => {
    const bg = index % 2 === 1 ? styles.altRowBgColor : styles.rowBgColor;
    const numericValue =
      typeof stat.value === "number"
        ? stat.value
        : parseFloat(String(stat.value)) || 0;

    const row = ws.addRow({
      label: stat.label ?? "",
      value: numericValue,
      suffix: stat.suffix ?? "",
      trend: stat.trend ? capitalize(String(stat.trend)) : "",
      trendValue: stat.trendValue ?? "",
      badge: stat.badge ?? "",
      description: stat.description ?? "",
    });

    row.height = 22;

    row.eachCell((cell, colNumber) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: bg },
      };

      const isValueCol = colNumber === keyToCol["value"];
      const isTrendValueCol = colNumber === keyToCol["trendValue"];

      cell.font = {
        name: styles.cellFontName,
        size: styles.cellFontSize,
        color: { argb: styles.cellFontColor },
        bold: isValueCol && styles.valueFontBold,
      };

      // Numbers stay right-aligned; text follows sheet direction
      let horizontal: "left" | "right" | "center" = rtl ? "right" : "left";
      if (isValueCol || isTrendValueCol) horizontal = "right";
      if (colNumber === keyToCol["badge"]) horizontal = "center";

      cell.alignment = {
        vertical: "middle",
        horizontal,
        readingOrder: rtl ? "rtl" : "ltr",
      };

      cell.border = {
        bottom: { style: "hair", color: { argb: "FFDDDDDD" } },
      };

      if (isValueCol) {
        cell.numFmt = Number.isInteger(numericValue) ? "0" : "0.0";
      }
    });

    // Trend colour
    if (stat.trend && keyToCol["trend"]) {
      const cell = row.getCell(keyToCol["trend"]);
      const color =
        stat.trend === "up"
          ? styles.trendUpColor
          : stat.trend === "down"
            ? styles.trendDownColor
            : styles.trendNeutralColor;
      cell.font = {
        name: styles.cellFontName,
        size: styles.cellFontSize,
        color: { argb: color },
        bold: true,
      };
    }

    // Badge
    if (stat.badge && keyToCol["badge"]) {
      const cell = row.getCell(keyToCol["badge"]);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: styles.badgeBgColor },
      };
      cell.font = {
        name: styles.cellFontName,
        size: styles.cellFontSize,
        color: { argb: styles.badgeFontColor },
        bold: true,
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        readingOrder: rtl ? "rtl" : "ltr",
      };
    }
  });

  // ── Chart ───────────────────────────────────────────────────────
  if (includeChart) {
    try {
      const dataUrl = await generateChartImage(stats, {
        title:
          getTranslation(t, `statistics.${fileName.replace(/\.xlsx$/i, "")}`) ??
          "statistics.chartTitle",
        ...chartOptions,
      });
      const base64 = dataUrl.split(",")[1];
      if (!base64) throw new Error("empty chart");

      const imageId = workbook.addImage({ base64, extension: "png" });
      ws.addImage(imageId, {
        tl: { col: 0, row: stats.length + 3 },
        ext: {
          width: chartOptions.width ?? 900,
          height: chartOptions.height ?? 480,
        },
      });
    } catch (err) {
      console.warn("[ExcelJS] chart failed:", err);
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`,
  );
}
