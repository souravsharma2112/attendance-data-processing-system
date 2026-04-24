import { memo, useState } from "react";
import styles from "./style.module.css";
import { Button, CheckboxComponent } from "../../ui";
import { exportExcelReport2 } from "../../../utils/exportExcelReport2";
import { exportExcelReport1 } from "../../../utils/exportExcelReport1";
import useDownloadPdf from "../../../hooks/useDownloadPdf";

type EmployeeRecord = {
    employeeID: number;
    name: string;
};

type Props = {
    isOpen: boolean;
    isPDF: boolean;
    onClose: (recordType: string) => void;
    employees: any[];
    record: EmployeeRecord[];
};

const ReportDownloadModal = ({
    isOpen,
    onClose,
    employees,
    isPDF = false,
    record,
}: Props) => {
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
    const [format, setFormat] = useState("excel");
   
    const recordType = isPDF ? "record1" : "record2";
    if (!isOpen) return null;

    const allEmployeeIds = record?.map((emp) => emp.employeeID) || [];

    const isAllSelected =
        allEmployeeIds.length > 0 &&
        selectedEmployees.length === allEmployeeIds.length;

    const handleCheckboxChange = (id: number) => {
        setSelectedEmployees((prev) =>
            prev.includes(id)
                ? prev.filter((empId) => empId !== id)
                : [...prev, id]
        );
    };

    console.log(selectedEmployees);

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(allEmployeeIds);
        }
    };

    const downloadPDF = useDownloadPdf();

    const handleDownload = () => {
        if (selectedEmployees.length === 0) {
            alert("Please select at least one employee.");
            return;
        }
        if (recordType === "record2") {
            exportExcelReport2(employees, selectedEmployees);
        }
        if (recordType === "record1" && format === "excel") {
            exportExcelReport1(employees, selectedEmployees);
        }
        if (recordType === "record1" && format === "pdf") {
            downloadPDF(employees,record ,selectedEmployees);
        }
    };

    const handleClose = () => {
        setSelectedEmployees([]);
        setFormat("excel");
        onClose(recordType);
    }
    console.log(record, "record");

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.container}>
                    <div className={styles.section}>
                        <p className={styles.title}>Employees</p>
                        <div className={styles.box}>
                            {record?.map((emp) => (
                                <CheckboxComponent
                                    key={emp.employeeID}
                                    name={`employee-${emp.employeeID}`}
                                    label={emp.name}
                                    checked={selectedEmployees.includes(emp.employeeID)}
                                    onChange={() => handleCheckboxChange(emp.employeeID)}
                                />
                            ))}

                            <CheckboxComponent
                                name="employeeAll"
                                label="Select All"
                                checked={isAllSelected}
                                onChange={handleSelectAll}
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <p className={styles.title}>Export In</p>
                        <div className={styles.box}>
                            {isPDF && (
                                <label className={styles.option}>
                                    <input
                                        type="radio"
                                        name="format"
                                        value="pdf"
                                        checked={format === "pdf"}
                                        onChange={() => setFormat("pdf")}
                                    />
                                    PDF
                                </label>
                            )}

                            <label className={styles.option}>
                                <input
                                    type="radio"
                                    name="format"
                                    value="excel"
                                    checked={format === "excel"}
                                    onChange={() => setFormat("excel")}
                                />
                                EXCEL
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <Button
                        title="Download Report"
                        className="w-full"
                        onClick={handleDownload}
                    />
                    <Button
                        title="Close"
                        className="w-full"
                        onClick={handleClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default memo(ReportDownloadModal);
