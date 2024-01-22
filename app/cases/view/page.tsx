import CasesAccordion from '@/components/CasesAccordion'
import { SelectForm } from '@/components/Select'
import React from 'react'

const ViewCases = () => {
  return (
    <div className='pt-32 pb-24 px-10'>
      <div className='font-bold text-2xl text-center pb-10'>
      View Cases
      </div>

      <CasesAccordion />
    </div>
  )
}

export default ViewCases
