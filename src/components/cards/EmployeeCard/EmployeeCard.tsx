import type { EmployeeCardProps } from "../../../types/card/EmployeeCardType";
import style from './style.module.css'

const EmployeeCard = ({ data }: EmployeeCardProps) => {
  const {
    name,
    designation,
    present = 0,
    absent = 0,
    halfday = 0,
    weekoff = 0,
    holiday = 0,
  } = data;

  return (
    <div className={style.card}>
      <div className={`flex justify-between items-center mb-4 ${style.sectionContent}`}>
        <h2>{name ?? "---"}</h2>
        <span>{designation ?? "---"}</span>
      </div>
      <div className="grid grid-cols-5 text-center gap-4">
        <div className={style.labelValue}>
          <p >Present</p>
          <p >{present}</p>
        </div>
        <div className={style.labelValue}>
          <p >Absent</p>
          <p >{absent}</p>
        </div>
        <div className={style.labelValue}>
          <p >Halfday</p>
          <p >{halfday}</p>
        </div>
        <div className={style.labelValue}>
          <p >WeekOff</p>
          <p >{weekoff}</p>
        </div>
        <div className={style.labelValue}>
          <p >Holiday</p>
          <p >{holiday}</p>
        </div>

      </div>
    </div>
  );
};

export default EmployeeCard;