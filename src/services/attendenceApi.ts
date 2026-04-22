export const getAttendanceAPI = async () => {
    try{
        const res = await fetch("/attendance_january.json");
        return res.json();
    }catch(err){
        console.error("Error fetching attendance data:", err);
        return null;
    }
};