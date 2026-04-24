export const getIndividualAttendance = (attendances:any) => {
  return attendances.map((item :any) => {
    let status = "";

    if (item.holiday) status = "Holiday";
    else if (item.week_off) status = "WeekOff";
    else if (item.absent) status = "Absent";
    else if (item.leave) status = "Leave";
    else if (item.half_day) status = "HalfDay";
    else status = "P";

    return {
      [item.date]: item.date,
      status : item.status,
    };
  });
};