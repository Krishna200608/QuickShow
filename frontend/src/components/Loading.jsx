import React from 'react'

const Loading = () => {
  return (
    <div className='flex flex-col justify-center items-center h-[80vh]'>
        <div className='animate-spin rounded-full h-18 w-18 border-3 border-t-primary'>

        </div>
        <p className='ml-2 mt-2 text-center font-medium text-lg px-2'>Loading...</p>
    </div>
  )
}

export default Loading