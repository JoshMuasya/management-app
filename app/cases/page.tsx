import { CasesCard } from '@/components/CasesCard'
import React from 'react'

const AddCases = () => {
  return (
    <div className="w-full h-fit flex flex-col justify-center align-middle items-center back-pic-dark bg-fixed bg-cover">
      <div className="z-10 w-full flex flex-col justify-center align-middle items-center mt-24 mb-14">
        <CasesCard />
      </div>
    </div>
  )
}

export default AddCases
