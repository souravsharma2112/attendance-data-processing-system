import React, { memo, useState } from 'react'
import { Button } from '../../../components/ui'
import { ReportDownloadModal } from '../../../components/modals'

const RightAside = ({ employees, record }) => {
  const [isModalOpen, setIsModalOpen] = useState({
    modalOpen: false,
    isPDF: false,
  });
  const handleClick = (recordType) => {
    setIsModalOpen((prev) => ({
      isPDF: recordType === "record1" ? true : false,
      modalOpen: !prev.modalOpen,
    }));
  }
  return (
    <aside className='h-full w-[350px] p-4 rounded-[20px] bg-yellow-500'>
      <div className='flex items-center justify-center p-3 rounded-md bg-black text-white font-bold capitalize'>
        <h2>Download Report</h2>
      </div>
      <div className="mt-8 space-y-4">
        <Button
          title="Report 1"
          onClick={() => handleClick("record1")}
          className="w-full"
        />
        <Button
          title="Report 2"
          onClick={() => handleClick("record2")}
          className="w-full"
        />
        <ReportDownloadModal
          isOpen={isModalOpen.modalOpen}
          isPDF={isModalOpen.isPDF}
          employees={employees}
          record={record}
          onClose={handleClick}
        />
      </div>
    </aside>
  )
}

export default memo(RightAside)