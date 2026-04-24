import { pdf } from "@react-pdf/renderer";
import AttendancePDF from "../components/pdfGenerator/AttendancePDF";
import type { AttendanceMonthlyRecordType } from "../types/AttendanceAPITypes";
import { toast } from "react-toastify";

const useDownloadPdf = () => {
    const downloadPDF = async (
        data: AttendanceMonthlyRecordType[],
        record:any[],
        selectedIds: number[] = [],
        fileName = "attendance-report.pdf"
    ) => {
        try {
            const blob = await pdf(
                <AttendancePDF data={data} record={record} selectedIds={selectedIds} />
            ).toBlob();

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            toast.success("PDF downloaded successfully!");

            setTimeout(() => URL.revokeObjectURL(url), 1000);

        } catch (error) {
            console.error("PDF Download Error:", error);
            toast.error("Failed to download PDF. Please try again.");
        }
    }

    return downloadPDF;
};

export default useDownloadPdf;
