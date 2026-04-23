import React, { useState } from "react";
import styles from "./style.module.css";
import { Button, CheckboxComponent } from "../../ui";
import { exportToExcel } from "../../../utils/exportExcelReport2";
import { exportExcelReport1 } from "../../../utils/exportExcelReport1";

type Employee = {
    id: number;
    name: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    employees: Employee[];
    onDownload: (selectedIds: number[], format: string) => void;
};

const ReportDownloadModal = ({
    isOpen,
    onClose,
    employees,
    onDownload,
}: Props) => {
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
    const [format, setFormat] = useState("pdf");

    if (!isOpen) return null;
    console.log(employees , "e");
    

    const handleDownload = () => {
  exportExcelReport1(employees, [1, 2]);
//   exportToExcel(employees, [1, 2]);
};

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.container}>
                    <div className={styles.section}>
                        <p className={styles.title}>Employees</p>
                        <div className={styles.box}>
                            {employees.map((emp, index) => (
                                <CheckboxComponent
                                    key={index}
                                    name={`employee-${emp.id}`}
                                    label={emp.name}
                                    checked={selectedEmployees.includes(emp.id)}
                                    onChange={() => { }}
                                />
                            ))}

                            <CheckboxComponent
                                name={`employeeAll`}
                                label={"Select All"}
                                // checked={selectedEmployees.includes(emp.id)}
                                onChange={() => { }}
                            />
                        </div>
                    </div>
                    <div className={styles.section}>
                        <p className={styles.title}>Export In</p>
                        <div className={styles.box}>
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
                <div >
                    <Button
                        title="Download Report"
                        className="w-full"
                        onClick={handleDownload}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReportDownloadModal;