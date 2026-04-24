import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 12,
    fontSize: 7,
    backgroundColor: "#ffffff",
  },
  employeeSection: {
    marginBottom: 10,
  },
  header: {
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  headerText: {
    marginBottom: 2,
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
  },
  summaryCol: {
    borderWidth: 1,
    borderColor: "#000000",
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#000000",
  },
  summaryCell: {
    flexGrow: 1,
    flexBasis: 0,
    minHeight: 40,
    borderRightWidth: 1,
    borderRightColor: "#000000",
  },
  summaryCellLast: {
    borderRightWidth: 0,
  },
  summaryHeader: {
    minHeight: 18,
    paddingHorizontal: 3,
    paddingVertical: 3,
    backgroundColor: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 6.5,
  },
  summaryValue: {
    minHeight: 20,
    paddingHorizontal: 3,
    paddingVertical: 3,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryValueText: {
    textAlign: "center",
    fontSize: 6,
    color: "#111827",
  },
  table: {
    borderWidth: 1,
    borderColor: "#000000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableHeaderRow: {
    backgroundColor: "#111827",
  },
  cellLabel: {
    width: 68,
    minHeight: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  headerLabelCell: {
    backgroundColor: "#111827",
    borderRightColor: "#ffffff",
  },
  dayHeaderCell: {
    width: 24,
    minHeight: 24,
    paddingHorizontal: 1,
    paddingVertical: 4,
    borderRightWidth: 1,
    borderRightColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
  },
  cell: {
    width: 24,
    height:"auto",
    // minHeight: 24,
    paddingHorizontal: 1,
    paddingVertical: 4,
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  zebraCell: {
    backgroundColor: "#f9fafb",
  },
  cellLast: {
    borderRightWidth: 0,
  },
  labelText: {
    fontWeight: "bold",
    fontSize: 6.5,
    color: "#111827",
  },
  tableHeaderText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 6.5,
  },
  rowLabelText: {
    fontWeight: "bold",
    fontSize: 6.2,
    textAlign: "center",
    color: "#111827",
  },
  cellText: {
    textAlign: "center",
    fontSize: 5.6,
    color: "#111827",
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 6,
  },
  statusPresent: {
    backgroundColor: "#dcfce7",
  },
  statusAbsent: {
    backgroundColor: "#fee2e2",
  },
  statusLeave: {
    backgroundColor: "#fef3c7",
  },
  statusHalfDay: {
    backgroundColor: "#fde68a",
  },
  statusWeekOff: {
    backgroundColor: "#e5e7eb",
  },
  statusHoliday: {
    backgroundColor: "#dbeafe",
  },
});
