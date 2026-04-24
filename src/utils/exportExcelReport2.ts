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
  selectedIds: number[] = []
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
        (emp.attendances || []).map((att: any) => att.date)
      )
    ),
  ];

  const dateColumns = workingDates.map((date) => ({
    header: date,
    key: date,
    width: 15,
  }));

  worksheet.columns = [
    { header: "Employee Name", key: "name", width: 25 },
    { header: "Designation", key: "designation", width: 20 },
    { header: "Department", key: "department", width: 20 },
    ...dateColumns,
    { header: "Total Present", key: "present", width: 15 },
    { header: "Total Absent", key: "absent", width: 15 },
    { header: "Total Leave", key: "leave", width: 15 },
    { header: "Total Halfday", key: "halfday", width: 15 },
    { header: "Total WeekOff", key: "weekoff", width: 15 },
    { header: "Total Holiday", key: "holiday", width: 15 },
  ];

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D9D9D9" },
    };
  });

  selectedEmp.forEach((emp: any) => {
    const rowData: any = {
      name: `${emp.employee?.first_name ?? ""} ${emp.employee?.last_name ?? ""}` || "-",
      designation: emp.employee?.designation || "-",
      department: emp.employee?.department_name || "-",
      present: 0,
      absent: 0,
      leave: 0,
      halfday: 0,
      weekoff: 0,
      holiday: 0,
    };

    const attendanceMap: Record<string, string> = {};

    (emp.attendances || []).forEach((att: any) => {
      const status = getStatus(att);
      attendanceMap[att.date] = status;

      if (status === "P") rowData.present++;
      if (status === "Absent") rowData.absent++;
      if (status === "Leave") rowData.leave++;
      if (status === "HalfDay") rowData.halfday++;
      if (status === "WeekOff") rowData.weekoff++;
      if (status === "Holiday") rowData.holiday++;
    });

    workingDates.forEach((date) => {
      rowData[date] = attendanceMap[date] || "";
    });

    const row = worksheet.addRow(rowData);

    workingDates.forEach((date) => {
      const colIndex = worksheet.getColumn(date).number;
      const cell = row.getCell(colIndex);
      const value = rowData[date];

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
        cell.alignment = { horizontal: "center" };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "Attendance_Report.xlsx");
};
