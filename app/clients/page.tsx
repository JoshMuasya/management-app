import { ClientCard } from '@/components/ClientCard'
import React from 'react'

const AddClient = () => {
  return (
    <div className="w-full h-fit flex flex-col justify-center align-middle items-center back-pic-dark bg-fixed bg-cover">
      <div className="z-10 w-full flex flex-col justify-center align-middle items-center mt-24 mb-14">
        <ClientCard />
      </div>
    </div>
  )
}

export default AddClient
