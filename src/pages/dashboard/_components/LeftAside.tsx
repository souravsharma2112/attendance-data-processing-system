import React, { memo } from 'react';

const LeftAside = () => {
    return (
        <aside className='h-full w-[280px] p-4 rounded-[20px] bg-green-500'>
            <div className='flex items-center justify-center p-3 rounded-md bg-black text-white font-bold capitalize'>
                <h2>Attendance</h2>
            </div>
        </aside>
    )
}

export default memo(LeftAside)