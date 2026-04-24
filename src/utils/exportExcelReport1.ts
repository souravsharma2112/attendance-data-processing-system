import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  calculateSummary,
  getStatus,
} from "../components/pdfGenerator/pdfHelper";
import type { AttendanceMonthlyRecordType } from "../types/AttendanceAPITypes";

const formatDuration = (mins?: number | string) => {
  const totalMinutes = Number(mins);

  if (!totalMinutes) return "-";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const getSummaryValue = (
  summaryData: Array<{ label: string; value: any }>,
  label: string,
) => summaryData.find((item) => item.label === label)?.value ?? "-";

export const exportExcelReport1 = async (
  data: AttendanceMonthlyRecordType[],
  selectedIds: number[] = [],
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

  selectedEmp.forEach((emp) => {
    const summaryData = calculateSummary(emp?.attendances);
    const empCode = emp?.employee?.id ?? "-";
    const depart = emp?.employee?.department_name ?? "N/A";
    const name =
      `${emp.employee?.first_name ?? ""} ${emp.employee?.last_name ?? ""}`.trim() ||
      "-";
    const leaveCount = (emp.attendances || []).filter(
      (att) => att.leave,
    ).length;
    const monthRow = worksheet.addRow([`January`]);
    const departmentRow = worksheet.addRow([`Department : ${depart}`]);

    monthRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        size: 32,
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "fafafa" },
      };
    });
    departmentRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        size: 20,
      };
    });
    const totalTableColumns = dates.length + 1;
    worksheet.mergeCells(
      monthRow.number,
      1,
      monthRow.number,
      totalTableColumns,
    );
    worksheet.mergeCells(
      departmentRow.number,
      1,
      departmentRow.number,
      totalTableColumns,
    );

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

    const summaryHeaderRow = worksheet.addRow(
      new Array(totalTableColumns).fill(""),
    );
    const summaryValueRow = worksheet.addRow(
      new Array(totalTableColumns).fill(""),
    );
    const baseSpan = Math.floor(totalTableColumns / summaryHeaders.length);
    const extraSpan = totalTableColumns % summaryHeaders.length;
    let startColumn = 1;

    summaryHeaders.forEach((header, index) => {
      const span = baseSpan + (index < extraSpan ? 1 : 0);
      const endColumn = startColumn + span - 1;

      worksheet.mergeCells(
        summaryHeaderRow.number,
        startColumn,
        summaryHeaderRow.number,
        endColumn,
      );
      worksheet.mergeCells(
        summaryValueRow.number,
        startColumn,
        summaryValueRow.number,
        endColumn,
      );

      const headerCell = summaryHeaderRow.getCell(startColumn);
      const valueCell = summaryValueRow.getCell(startColumn);

      headerCell.value = header;
      headerCell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      };
      headerCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "000000" },
      };

      valueCell.value = summaryValues[index];

      startColumn = endColumn + 1;
    });

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

      const status = getStatus(att);

      inRow.push(att.in_formatted_time || "-");
      outRow.push(att.out_formatted_time || "-");
      workRow.push(formatDuration(att.total_work_duration));
      statusRow.push(status);
    });

    const row1 = worksheet.addRow(inRow);
    const row2 = worksheet.addRow(outRow);
    worksheet.addRow(workRow);
    const row4 = worksheet.addRow(statusRow);

    row1.eachCell((cell) => {
      cell.font = {
        color: { argb: "FF008000" },
      };
    });

    row2.eachCell((cell) => {
      cell.font = {
        color: { argb: "FFFF0000" },
      };
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
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
  });

  worksheet.eachRow({ includeEmpty: true }, (row) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "Attendance_Matrix_Report.xlsx");
};
