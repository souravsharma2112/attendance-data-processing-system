import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 6, // VERY IMPORTANT (fit 31 cols)
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    border: "1px solid #ccc",
    padding: 2,
    width: 20,
    textAlign: "center",
  },
  header: {
    fontWeight: "bold",
    backgroundColor: "#eee",
  },
});

const getStatusShort = (item) => {
  if (item.holiday) return "HO";
  if (item.week_off) return "WO";
  if (item.absent) return "A";
  if (item.leave) return "L";
  if (item.half_day) return "HD";
  return "P";
};

const AttendancePDF = ({ data, selectedIds }) => {
  const selectedEmp =
    selectedIds?.length > 0
      ? data.filter((emp) =>
          selectedIds.includes(emp.employee.id)
        )
      : data;

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={{ textAlign: "center", marginBottom: 5 }}>
          Month: January
        </Text>

        {selectedEmp.map((emp, idx) => {
          const attendanceMap = {};
          emp.attendances.forEach((att) => {
            const d = parseInt(att.date.split("-")[0], 10);
            attendanceMap[d] = att;
          });

          return (
            <View key={idx} style={{ marginBottom: 5 }}>
              {/* HEADER ROW */}
              <View style={styles.row}>
                <Text style={[styles.cell, styles.header]}>
                  EmpCode
                </Text>
                <Text style={[styles.cell, styles.header]}>
                  Name
                </Text>
                <Text style={[styles.cell, styles.header]}>
                  Label
                </Text>

                {days.map((d) => (
                  <Text key={d} style={[styles.cell, styles.header]}>
                    {d}
                  </Text>
                ))}
              </View>

              {/* STATUS ROW */}
              <View style={styles.row}>
                <Text style={styles.cell}>
                  {emp.employee.emp_code}
                </Text>
                <Text style={styles.cell}>
                  {emp.employee.first_name}
                </Text>
                <Text style={styles.cell}>Status</Text>

                {days.map((d) => {
                  const att = attendanceMap[d];
                  return (
                    <Text key={d} style={styles.cell}>
                      {att ? getStatusShort(att) : ""}
                    </Text>
                  );
                })}
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
};