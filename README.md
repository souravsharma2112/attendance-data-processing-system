Attendance Data Processing Assignment

Objective
Build a data-processing flow for attendance data and generate clean outputs that can be used for report download features.

Available Files
1) attendance_january.json
   - Structure: { "results": [ { "employee": {...}, "attendances": [...] }, ... ] }
2) employess.json
   - contains employees data.
3) flow-1.png
   - UI wireframe showing attendance cards and report download buttons.
4) flow-2.png
   - UI wireframe showing a report export modal (employee selection + PDF/Excel choice).
5) report_1.xlsx
   - Sample Excel output format.
6) report_2.pdf
   - Sample PDF output format.

What Needs To Be Implemented
1) Attendance dashboard using Flow 1
- Read data from attendance_january.json.
- Display employee-wise attendance cards on the screen.
- For each employee, calculate and show attendance statistics, including:
  - Present
  - Absent
  - Halfday
  - WeekOff
  - Holiday
- The statistics must be calculated from the attendances array (not hardcoded).

2) Report 1 behavior (Export modal with employee selection)
- When the user clicks Report 1, open a modal.
- In the modal, show all employees from the dataset as selectable options.
- The report must include data only for the selected employee(s).
- Report 1 must support export in both formats:
  - Excel (.xlsx)
  - PDF (.pdf)

3) Report 2 behavior (Excel-only export)
- When the user clicks Report 2, open a modal.
- In the modal, show all employees from the dataset as selectable options
- In this modal, show only Excel format selection.
- Export for Report 2 must be Excel only (no PDF option).

4) Output and validation expectations
- Exported file must strictly follow selected employees only.
- Report format should be clean and readable.
- Attendance statistics shown in UI should match exported data.
