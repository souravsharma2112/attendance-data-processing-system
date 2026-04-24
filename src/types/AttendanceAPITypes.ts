export interface AttendanceRecord {
  date: string;
  in_formatted_time: string;
  out_formatted_time: string;
  duration: number;
  total_work_duration: number;
  break_duration: number;
  leave: boolean;
  absent: boolean;
  holiday: boolean;
  week_off: boolean;
  late: boolean;
  early_exit: boolean;
  half_day: boolean;
  night_shift: boolean;
}

export interface EmployeeDetails {
  id: number;
  first_name: string;
  last_name: string;
  designation: string;
  department_name: string;
}
export interface AttendanceMonthlyRecordType {
  employee: EmployeeDetails;
  attendances: AttendanceRecord[];
}
export interface AttendanceAPIType {
  result: AttendanceMonthlyRecordType[];
}
