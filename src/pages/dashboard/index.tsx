import React from 'react'
import { LeftAside, RightAside } from './_components'
import useAttendanceAPI from '../../hooks/useAttendanceAPI'
import useEmployeeReport from '../../hooks/useEmployeeReport'
import { EmployeeCard } from '../../components/cards'

const Dashboard = () => {
  const { isLoading, data, isError } = useAttendanceAPI()
  
  const { record } = useEmployeeReport({ employeeData: data ?? {} });

  if (isLoading) return <h1>Loading....</h1>
  if (isError) return <h1>{"Something Wents Wrong."}</h1>

  return (
    <div className='flex gap-4 h-[100vh] w-full p-4 bg-orange-400'>
      <LeftAside />
      <main className='flex-1 h-full w-full rounded-[20px] space-y-4 overflow-y-auto bg-yellow-200 overflow-x-none p-4'>
        {(record.length > 0) && record.map((item, index) => <EmployeeCard key={`employee-${index}`} data={item} />)}
      </main>
      <RightAside employees={data} record={record} />
    </div>
  )
}

export default Dashboard;