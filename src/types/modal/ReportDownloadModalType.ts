export interface EmployeeRecord{
    employeeID: number;
    name: string;
};

export interface ReportDownloadModalType{
    isOpen: boolean;
    isPDF: boolean;
    onClose: (recordType: string) => void;
    employees: any[];
    record: EmployeeRecord[];
};