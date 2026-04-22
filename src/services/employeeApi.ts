export const getEmployeeAPI = async () => {
    try{
        const res = await fetch("/employess.json");
        return res.json();
    }catch(err){
        console.error("Error fetching employee data:", err);
        return null;
    }
};