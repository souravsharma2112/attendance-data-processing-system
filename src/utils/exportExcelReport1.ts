import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const getStatusShort = (item) => {
  if (item.holiday) return "HO";
  if (item.week_off) return "WO";
  if (item.absent) return "A";
  if (item.leave) return "L";
  if (item.half_day) return "HD";
  return "P";
};

export const exportExcelReport1 = async (data, selectedIds = []) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Attendance");

  // ✅ FILTER SELECTED EMPLOYEES
  const selectedEmp =
    Array.isArray(selectedIds) && selectedIds.length
      ? data.filter((emp) =>
          selectedIds.includes(emp?.employee?.id)
        )
      : data;

  if (!selectedEmp.length) {
    alert("No data found for selected employees");
    return;
  }

  const daysInMonth = 31; // you can make dynamic
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // ---------------- HEADER ----------------
  worksheet.mergeCells(`A1:${String.fromCharCode(65 + 3 + daysInMonth)}1`);
  worksheet.getCell("A1").value = "Month : January";
  worksheet.getCell("A1").alignment = { horizontal: "center" };
  worksheet.getCell("A1").font = { bold: true, size: 14 };

  // Column Setup
  worksheet.columns = [
    { header: "EmpCode", width: 15 },
    { header: "Name", width: 25 },
    { header: "Label", width: 12 },
    ...dates.map((d) => ({ header: d.toString(), width: 10 })),
  ];

  // Header Style
  worksheet.getRow(2).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center" };
  });

  // ---------------- DATA ----------------
  selectedEmp.forEach((emp) => {
    const empCode = emp.employee?.emp_code || "-";
    const name = `${emp.employee?.first_name || ""} ${
      emp.employee?.last_name || ""
    }`;

    const attendanceMap = {};
    (emp.attendances || []).forEach((att) => {
      const day = parseInt(att.date.split("-")[0], 10);
      attendanceMap[day] = att;
    });

    const inRow = ["", "", "IN Time"];
    const outRow = ["", "", "OUT Time"];
    const workRow = ["", "", "Working"];
    const statusRow = [empCode, name, "Status"];

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

      const hrs = att.total_work_duration
        ? `${Math.floor(att.total_work_duration / 60)
            .toString()
            .padStart(2, "0")}:${(att.total_work_duration % 60)
            .toString()
            .padStart(2, "0")}`
        : "-";

      workRow.push(hrs);
      statusRow.push(status);
    });

    const r1 = worksheet.addRow(inRow);
    const r2 = worksheet.addRow(outRow);
    const r3 = worksheet.addRow(workRow);
    const r4 = worksheet.addRow(statusRow);

    // ✅ COLOR STATUS
    r4.eachCell((cell, colNumber) => {
      if (colNumber <= 3) return;

      const value = cell.value;

      let color = "";
      switch (value) {
        case "P":
          color = "C6EFCE";
          break;
        case "A":
          color = "FFC7CE";
          break;
        case "L":
          color = "FFEB9C";
          break;
        case "HD":
          color = "FFE699";
          break;
        case "WO":
          color = "D9D9D9";
          break;
        case "HO":
          color = "BDD7EE";
          break;
      }

      if (color) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: color },
        };
        cell.alignment = { horizontal: "center" };
      }
    });

    worksheet.addRow([]); // spacing
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "Attendance_Matrix_Report.xlsx");
};