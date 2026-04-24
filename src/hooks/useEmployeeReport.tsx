import { useMemo } from "react";
import { EmployeeDataDefault, type EmployeeDataType } from "../types/card/EmployeeCardType";

const useEmployeeReport = ({ employeeData }) => {
  const record = useMemo(() => {
    if (!Array.isArray(employeeData)) return [];

    return employeeData.map((employee) => {
      const stats: EmployeeDataType = {
        ...EmployeeDataDefault,
        employeeID : employee?.employee?.id ?? "---",
        name: `${employee?.employee?.first_name} ${employee?.employee?.last_name}` || "---",
        designation: employee?.employee?.designation ?? "---",
      };

      if (Array.isArray(employee?.attendances)) {
        employee.attendances.forEach((item) => {
          if (item?.leave) stats.absent += 1;
          else if (item?.halfday) stats.halfday += 1;
          else if (item?.week_off) stats.weekoff += 1;
          else if (item?.holiday) stats.holiday += 1;
          else stats.present += 1;
        });
      }
      return stats;
    });

  }, [employeeData]);

  return { record };
};

export default useEmployeeReport;