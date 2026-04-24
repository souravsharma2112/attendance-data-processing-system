import { useEffect, useState } from "react";
import { getEmployeeAPI } from "../services/employeeApi";

const useEmployeesAPI = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<string|null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getEmployeeAPI();
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

export default useEmployeesAPI;