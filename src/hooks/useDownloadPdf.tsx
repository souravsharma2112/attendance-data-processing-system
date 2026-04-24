import { pdf } from "@react-pdf/renderer";
import AttendancePDF from "../components/pdfGenerator/AttendancePDF";
import type { AttendanceMonthlyRecordType } from "../types/AttendanceAPITypes";

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

            setTimeout(() => URL.revokeObjectURL(url), 1000);

        } catch (error) {
            console.error("PDF Download Error:", error);
        }
    }

    return downloadPDF;
};

export default useDownloadPdf;
