import { Document, Page, Text, View} from "@react-pdf/renderer";
import { styles } from "./AttendanceStyle";
import { calculateSummary, getStatus } from "./pdfHelper";

type AttendanceItem = Record<string, any> & {
    absent?: boolean;
    date: string;
    duration?: number;
    half_day?: boolean;
    holiday?: boolean;
    leave?: boolean;
    total_work_duration?: number;
    week_off?: boolean;
};

type EmployeeAttendance = {
    attendances: AttendanceItem[];
    employee: {
        department_name?: string;
        designation?: string;
        first_name?: string;
        id: number;
        last_name?: string;
    };
};

type AttendancePDFProps = {
    data?: EmployeeAttendance[];
    selectedIds?: number[];
    record?: any[];
};

const formatDuration = (mins?: number) => {
    if (!mins) return "-";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};


const getSummaryCellStyle = (isLast: boolean) =>
    isLast ? [styles.summaryCell, styles.summaryCellLast] : styles.summaryCell;

const getTableRowStyle = (isLast: boolean) =>
    isLast ? [styles.tableRow, styles.tableRowLast] : styles.tableRow;

const getDayHeaderCellStyle = (isLast: boolean) =>
    isLast ? [styles.dayHeaderCell, styles.cellLast] : styles.dayHeaderCell;

const getBodyCellStyle = (
    isLast: boolean,
    rowIndex: number,
    rowKey: string,
    value: string
) => {
    const cellStyles: any[] = [styles.cell];

    if (rowIndex % 2 === 1 && rowKey !== "status") {
        cellStyles.push(styles.zebraCell);
    }

    if (rowKey === "status") {
        if (value === "P") cellStyles.push(styles.statusPresent);
        if (value === "A") cellStyles.push(styles.statusAbsent);
        if (value === "L") cellStyles.push(styles.statusLeave);
        if (value === "HD") cellStyles.push(styles.statusHalfDay);
        if (value === "WO") cellStyles.push(styles.statusWeekOff);
        if (value === "HO") cellStyles.push(styles.statusHoliday);
    }

    if (isLast) {
        cellStyles.push(styles.cellLast);
    }

    return cellStyles;
};

const getCellTextStyle = (rowKey: string) =>
    rowKey === "status" ? [styles.cellText, styles.statusText] : styles.cellText;

const AttendancePDF = ({
    data = [],
    selectedIds = []
}: AttendancePDFProps) => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const reportRows = [
        { label: "IN Time", key: "in_formatted_time" },
        { label: "OUT Time", key: "out_formatted_time" },
        { label: "Working", key: "duration", isDuration: true },
        { label: "O.Times", key: "ot", isDuration: true },
        { label: "Status", key: "status" }
    ];
    const filteredData = selectedIds.length > 0
        ? data.filter((emp) => selectedIds.includes(emp.employee.id))
        : data;

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page} wrap>
                {filteredData.map((emp, index) => {
                    const summaryItems = calculateSummary(emp.attendances);
                    return (
                        <View key={index} style={styles.employeeSection} wrap={false}>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>
                                    EmpCode: {emp.employee.id} | Name: {emp.employee.first_name} {emp.employee.last_name}
                                </Text>
                                <Text style={styles.headerText}>
                                    Dept: {emp.employee.department_name} | Desig: {emp.employee.designation}
                                </Text>
                            </View>
                            <View style={styles.summaryRow}>
                                {summaryItems.map((item, summaryIndex) => (
                                    <View
                                        key={item.label}
                                        style={getSummaryCellStyle(summaryIndex === summaryItems.length - 1)}
                                    >
                                        <View style={styles.summaryHeader}>
                                            <Text style={styles.summaryText}>{item.label}</Text>
                                        </View>
                                        <View style={styles.summaryValue}>
                                            <Text style={styles.summaryValueText}>{item.value}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.table}>
                                <View style={[styles.tableRow, styles.tableHeaderRow]}>
                                    <View style={[styles.cellLabel, styles.headerLabelCell]}>
                                        <Text style={styles.tableHeaderText}>Label</Text>
                                    </View>
                                    {days.map((day, dayIndex) => (
                                        <View
                                            key={day}
                                            style={getDayHeaderCellStyle(dayIndex === days.length - 1)}
                                        >
                                            <Text style={styles.tableHeaderText}>{day}</Text>
                                        </View>
                                    ))}
                                </View>
                                {reportRows.map((row, rowIndex) => (
                                    <View
                                        key={row.label}
                                        style={getTableRowStyle(rowIndex === reportRows.length - 1)}
                                    >
                                        <View style={styles.cellLabel}>
                                            <Text style={styles.rowLabelText}>{row.label}</Text>
                                        </View>
                                        {emp?.attendances?.map((att, dayIndex) => {
                                            let value = "-";
                                            if (att) {
                                                if (row.key === "status") value = getStatus(att);
                                                else if (row.isDuration) value = formatDuration(att.duration);
                                                else value = att[row.key] || "-";
                                            }
                                            return (
                                                <View
                                                    key={`day-${dayIndex + 1}`}
                                                    style={getBodyCellStyle(
                                                        dayIndex === days.length - 1,
                                                        rowIndex,
                                                        row.key,
                                                        value
                                                    )}
                                                >
                                                    <Text style={getCellTextStyle(row.key)}>{value}</Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                ))}
                            </View>
                        </View>
                    );
                })}
            </Page>
        </Document>
    );
};

export default AttendancePDF;
