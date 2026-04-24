import { useEffect, useState } from "react";
import { getAttendanceAPI } from '../services/attendenceApi';
import type { AttendanceMonthlyRecordType } from "../types/AttendanceAPITypes";

const useAttendanceAPI = () => {
  const [data, setData] = useState<AttendanceMonthlyRecordType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAttendanceAPI();
        setData(res.results || []);
      } catch (err) {
         setIsError("Something Wents Wrong..");
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  return { data, isLoading, isError };
}

export default useAttendanceAPI;