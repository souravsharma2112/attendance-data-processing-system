
export const EmployeeDataDefault = {
    employeeID: "",
    name: "",
    designation : "",
    present: 0,
    absent: 0,
    halfday: 0,
    weekoff: 0,
    holiday: 0,
    totalDuration: 0,
    paid:0,
}

export interface EmployeeDataType {
    employeeID: string;
    name: string;
    designation: string;
    present: number;
    absent: number;
    halfday: number;
    weekoff: number;
    holiday: number;
    totalDuration: number;
    paid: number;
};

export interface EmployeeCardProps {
    data: EmployeeDataType;
};