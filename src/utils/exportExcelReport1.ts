import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { calculateSummary } from "../components/pdfGenerator/pdfHelper";

const getStatusShort = (item: any) => {
  if (item.holiday) return "HO";
  if (item.week_off) return "WO";
  if (item.absent) return "A";
  if (item.leave) return "L";
  if (item.half_day) return "HD";
  return "P";
};

const formatDuration = (mins?: number | string) => {
  const totalMinutes = Number(mins);

  if (!totalMinutes) return "-";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const getSummaryValue = (summaryData: Array<{ label: string; value: any }>, label: string) =>
  summaryData.find((item) => item.label === label)?.value ?? "-";

export const exportExcelReport1 = async (
  data: any[],
  selectedIds: number[] = []
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Attendance");

  const selectedEmp =
    Array.isArray(selectedIds) && selectedIds.length
      ? data.filter((emp) => selectedIds.includes(emp?.employee?.id))
      : data;

  if (!selectedEmp.length) {
    alert("No data found for selected employees");
    return;
  }

  const daysInMonth = 31;
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalWorksheetColumns = dates.length + 1;
  const summaryHeaders = [
    "EmpCode",
    "Name",
    "Present",
    "Holiday",
    "WeekOff",
    "HalfDay",
    "Absent",
    "Leave",
    "PaidDay",
    "Total Work Hrs",
  ];

  worksheet.mergeCells(1, 1, 1, totalWorksheetColumns);
  worksheet.getCell("A1").value = "Month : January";
  worksheet.getCell("A1").alignment = { horizontal: "center" };
  worksheet.getCell("A1").font = { bold: true, size: 14 };

  worksheet.columns = [
    { header: "Label", width: 14 },
    ...dates.map((day) => ({ header: day.toString(), width: 10 })),
  ];

  selectedEmp.forEach((emp: any) => {
    const summaryData = calculateSummary(emp.attendances);
    const empCode = emp.employee?.emp_code || emp.employee?.id || "-";
    const name = `${emp.employee?.first_name || ""} ${
      emp.employee?.last_name || ""
    }`.trim() || "-";
    const leaveCount = (emp.attendances || []).filter((att: any) => att.leave).length;

    // Table 1: summary header row and summary value row
    const summaryValues = [
      empCode,
      name,
      getSummaryValue(summaryData, "Present"),
      getSummaryValue(summaryData, "Holiday"),
      getSummaryValue(summaryData, "WeekOff"),
      getSummaryValue(summaryData, "Halfday"),
      getSummaryValue(summaryData, "Absent"),
      leaveCount,
      getSummaryValue(summaryData, "PaidDay"),
      formatDuration(getSummaryValue(summaryData, "WorkHrs")),
    ];

    const summaryHeaderRow = worksheet.addRow(new Array(totalWorksheetColumns).fill(""));
    const summaryValueRow = worksheet.addRow(new Array(totalWorksheetColumns).fill(""));
    const baseSpan = Math.floor(totalWorksheetColumns / summaryHeaders.length);
    const extraSpan = totalWorksheetColumns % summaryHeaders.length;
    let startColumn = 1;

    summaryHeaders.forEach((header, index) => {
      const span = baseSpan + (index < extraSpan ? 1 : 0);
      const endColumn = startColumn + span - 1;

      worksheet.mergeCells(summaryHeaderRow.number, startColumn, summaryHeaderRow.number, endColumn);
      worksheet.mergeCells(summaryValueRow.number, startColumn, summaryValueRow.number, endColumn);

      for (let columnNumber = startColumn; columnNumber <= endColumn; columnNumber++) {
        const headerPartCell = worksheet.getCell(summaryHeaderRow.number, columnNumber);
        const valuePartCell = worksheet.getCell(summaryValueRow.number, columnNumber);

        headerPartCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "000000" },
        };
        headerPartCell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: columnNumber === startColumn ? { style: "thin", color: { argb: "000000" } } : undefined,
          bottom: { style: "thin", color: { argb: "000000" } },
          right: columnNumber === endColumn ? { style: "thin", color: { argb: "000000" } } : undefined,
        };

        valuePartCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F3F4F6" },
        };
        valuePartCell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: columnNumber === startColumn ? { style: "thin", color: { argb: "000000" } } : undefined,
          bottom: { style: "thin", color: { argb: "000000" } },
          right: columnNumber === endColumn ? { style: "thin", color: { argb: "000000" } } : undefined,
        };
      }

      const headerCell = worksheet.getCell(summaryHeaderRow.number, startColumn);
      const valueCell = worksheet.getCell(summaryValueRow.number, startColumn);

      headerCell.value = header;
      headerCell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerCell.alignment = { horizontal: "center", vertical: "middle" };

      valueCell.value = summaryValues[index];
      valueCell.font = { bold: false, color: { argb: "111827" } };
      valueCell.alignment = { horizontal: "center", vertical: "middle" };

      startColumn = endColumn + 1;
    });

    // Table 2: daily attendance matrix
    const matrixHeaderRow = worksheet.addRow(["Label", ...dates]);
    matrixHeaderRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "111827" },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    });

    const attendanceMap: Record<number, any> = {};
    (emp.attendances || []).forEach((att: any) => {
      const day = Number.parseInt(att.date.split("-")[0], 10);
      attendanceMap[day] = att;
    });

    const inRow = ["IN Time"];
    const outRow = ["OUT Time"];
    const workRow = ["Working"];
    const statusRow = ["Status"];

    dates.forEach((day) => {
      const att = attendanceMap[day];

      if (!att) {
        inRow.push("-");
        outRow.push("-");
        workRow.push("-");
        statusRow.push("");
        return;
      }

      const status = getStatusShort(att);

      inRow.push(att.in_formatted_time || "-");
      outRow.push(att.out_formatted_time || "-");
      workRow.push(formatDuration(att.total_work_duration));
      statusRow.push(status);
    });

    const row1 = worksheet.addRow(inRow);
    const row2 = worksheet.addRow(outRow);
    const row3 = worksheet.addRow(workRow);
    const row4 = worksheet.addRow(statusRow);

    [row1, row2, row3, row4].forEach((row, index) => {
      row.eachCell((cell, colNumber) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin", color: { argb: "D1D5DB" } },
          left: { style: "thin", color: { argb: "D1D5DB" } },
          bottom: { style: "thin", color: { argb: "D1D5DB" } },
          right: { style: "thin", color: { argb: "D1D5DB" } },
        };

        if (colNumber === 1) {
          cell.font = { bold: true, color: { argb: "111827" } };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F3F4F6" },
          };
          return;
        }

        if (index % 2 === 1 && index !== 3) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F9FAFB" },
          };
        }
      });
    });

    row4.eachCell((cell, colNumber) => {
      if (colNumber === 1) return;

      const value = cell.value;
      let color = "";

      switch (value) {
        case "P":
          color = "DCFCE7";
          break;
        case "A":
          color = "FEE2E2";
          break;
        case "L":
          color = "FEF3C7";
          break;
        case "HD":
          color = "FDE68A";
          break;
        case "WO":
          color = "E5E7EB";
          break;
        case "HO":
          color = "DBEAFE";
          break;
      }

      if (color) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: color },
        };
      }

      cell.font = { bold: true, color: { argb: "111827" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // gap between employees
    worksheet.addRow([]);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "Attendance_Matrix_Report.xlsx");
};
