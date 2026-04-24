import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const getStatus = (item: any) => {
  if (item.holiday) return "Holiday";
  if (item.week_off) return "WeekOff";
  if (item.absent) return "Absent";
  if (item.leave) return "Leave";
  if (item.half_day) return "HalfDay";
  return "P";
};

export const exportExcelReport2 = async (
  data: any[],
  selectedIds: number[] = [],
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Attendance");

  const selectedEmp =
    Array.isArray(selectedIds) && selectedIds.length
      ? data.filter((emp) => selectedIds.includes(emp?.employee?.id))
      : data;

  if (!selectedEmp?.length) {
    alert("No data found for selected employees");
    return;
  }

  const workingDates = [
    ...new Set(
      selectedEmp.flatMap((emp: any) =>
        (emp.attendances || []).map((att: any) => att.date),
      ),
    ),
  ];

  const dateColumns = workingDates.map((date) => date);

  const header1 = worksheet.addRow([
    "Employee Name",
    "Designation",
    "Department",
    ...dateColumns,
    "Total Present",
    "Total Absent",
    "Total Leave",
    "Total Halfday",
    "Total WeekOff",
    "Total Holiday",
  ]);

  header1.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D9D9D9" },
    };
  });

  const rows = selectedEmp.map((emp: any) => {
    let present = 0;
    let absent = 0;
    let leave = 0;
    let halfday = 0;
    let weekoff = 0;
    let holiday = 0;

    const attendanceMap: Record<string, string> = {};

    (emp.attendances || []).forEach((att: any) => {
      const status = getStatus(att);
      attendanceMap[att.date] = status;

      if (status === "P") present++;
      if (status === "Absent") absent++;
      if (status === "Leave") leave++;
      if (status === "HalfDay") halfday++;
      if (status === "WeekOff") weekoff++;
      if (status === "Holiday") holiday++;
    });

    const attendanceByDates = workingDates.map(
      (date) => attendanceMap[date] || "",
    );

    return [
      `${emp.employee?.first_name ?? ""} ${emp.employee?.last_name ?? ""}` ||
        "-",
      emp.employee?.designation || "-",
      emp.employee?.department_name || "-",
      ...attendanceByDates,
      present,
      absent,
      leave,
      halfday,
      weekoff,
      holiday,
    ];
  });

  rows.forEach((item) => {
    const rowData = worksheet.addRow(item);

    item.forEach((value, index) => {
      const cell = rowData.getCell(index + 1);

      if (index < 3) return;

      if (typeof value === "number") {
        cell.alignment = { horizontal: "center" };
        return;
      }

      if (!value) return;

      let color = "";

      switch (value) {
        case "P":
          color = "C6EFCE";
          break;
        case "Absent":
          color = "FFC7CE";
          break;
        case "Leave":
          color = "FFEB9C";
          break;
        case "HalfDay":
          color = "FFE699";
          break;
        case "WeekOff":
          color = "D9D9D9";
          break;
        case "Holiday":
          color = "BDD7EE";
          break;
      }

      if (color) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: color },
        };

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        cell.font = {
          bold: true,
        };
      }
    });
  });

  worksheet.columns.forEach((column : any) => {
    let maxLength = 0;

    column.eachCell({ includeEmpty: true }, (cell : any) => {
      const cellValue = cell.value ? cell.value.toString() : "";
      maxLength = Math.max(maxLength, cellValue.length);
    });

    column.width = maxLength + 2;
  });
  worksheet.eachRow({ includeEmpty: true }, (row) => {
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
});

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "Attendance_Report.xlsx");
};