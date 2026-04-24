import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const exportFinalExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Demo");

  // 👉 Equal width columns (3 columns)
  const totalColumns = 3;
  const totalWidth = 90;
  const columnWidth = totalWidth / totalColumns;

  worksheet.columns = Array.from({ length: totalColumns }, () => ({
    width: columnWidth,
  }));

  // ------------------ Table 1 ------------------
  const header1 = worksheet.addRow(["EmpCode", "Name", "Present"]);

  header1.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "000000" },
    };
    cell.font = {
      color: { argb: "FFFFFFFF" },
      bold: true,
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });

  const row1 = worksheet.addRow([101, "John", 20]);
  const row2 = worksheet.addRow([102, "Sam", 18]);

  // 👉 Name column blue
  [row1, row2].forEach((row) => {
    const nameCell = row.getCell(2);
    nameCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "0000FF" },
    };
    nameCell.font = {
      color: { argb: "FFFFFFFF" },
      bold: true,
    };
  });

  worksheet.addRow([]);

  // ------------------ Table 2 ------------------
  const header2 = worksheet.addRow(["Dept", "Role", "Salary"]);

  header2.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "000000" },
    };
    cell.font = {
      color: { argb: "FFFFFFFF" },
      bold: true,
    };
  });

  worksheet.addRow(["IT", "Developer", 50000]);
  worksheet.addRow(["HR", "Manager", 60000]);

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "Final_Excel_Report.xlsx");
};

export default exportFinalExcel;