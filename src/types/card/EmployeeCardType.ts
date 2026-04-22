
export const EmployeeDataDefault = {
    name: "",
    designation : "",
    present: 0,
    absent: 0,
    halfday: 0,
    weekoff: 0,
    holiday: 0,
}

export interface EmployeeDataType {
    name: string;
    designation: string;
    present: number;
    absent: number;
    halfday: number;
    weekoff: number;
    holiday: number;
};

export interface EmployeeCardProps {
    data: EmployeeDataType;
};