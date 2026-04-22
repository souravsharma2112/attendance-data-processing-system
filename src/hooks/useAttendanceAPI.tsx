import { useEffect, useState } from "react";
import { getAttendanceAPI } from '../services/attendenceApi';

const useAttendanceAPI = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

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