type AttendanceItem = Record<string, any> & {
    absent?: boolean;
    date: string;
    duration?: number;
    half_day?: boolean;
    holiday?: boolean;
    leave?: boolean;
    total_work_duration?: number;
    week_off?: boolean;
};

export const calculateSummary = (attendances: AttendanceItem[] = []) => {
    const summary = {
        present: 0,
        holiday: 0,
        weekoff: 0,
        absent: 0,
        halfday: 0,
        paid: 0,
        totalMinutes: 0,
        breakDuration: 0,
        outFormattedTime: "",
    };

    attendances.forEach((a: AttendanceItem) => {
        if (a.holiday) summary.holiday++;
        else if (a.week_off) summary.weekoff++;
        else if (a.absent) summary.absent++;
        else if (a.half_day) summary.halfday++;
        else summary.present++;
        if (!a.absent) summary.paid++;
        summary.totalMinutes += a.total_work_duration || 0;
        summary.breakDuration += a.break_duration || 0;
        summary.outFormattedTime = "00:00";
    });

    // return summary;
    const summaryData = [
        { label: "Present", value: summary.present },
        { label: "Holiday", value: summary.holiday },
        { label: "WeekOff", value: summary.weekoff },
        { label: "Halfday", value: summary.halfday },
        { label: "Absent", value: summary.absent },
        { label: "PaidDay", value: summary.paid },
        { label: "WorkHrs", value: summary.totalMinutes },
        { label: "ShortHrs", value: summary.breakDuration },
        { label: "OT Hrs", value: summary?.outFormattedTime }
    ]
    return summaryData;
};


export const getStatus = (att: AttendanceItem) => {
    if (att.holiday) return "HO";
    if (att.week_off) return "WO";
    if (att.absent) return "A";
    if (att.leave) return "L";
    if (att.half_day) return "HD";
    return "P";
};