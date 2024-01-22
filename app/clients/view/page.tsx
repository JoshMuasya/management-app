import { DataTable } from '@/components/table/Table'
import { columns } from '@/components/table/column'
import React from 'react'

const getData = async () => {
  return [
    {
      clientId: '564314',
      clientName: 'test',
      phoneNumber: '075421354',
      pin: 'A5645126541D',
      email: 'test@example.com',
      address: 'Nairobi',
      servicesProvided: 'Civil',
      indemnityClause: 'TBU',
      nokName: 'Next Name',
      nokPhonenumber: '078895402456',
      nokAddress: 'Nairobi'
    }
  ]
}

const ViewClients = async () => {
  const data = await getData()

  return (
    <div className='pt-28 pb-14 px-10 w-full'>
      <div className='flex flex-col justify-center align-middle items-center w-full'>
        {/* Topic */}
      <div className='font-bold text-2xl text-center pb-10'>
        View Clients
      </div>

      {/* View Clients */}
      <div className='w-full'>
        <DataTable 
          columns={columns}
          data={data}
        />        
      </div>
      </div>
    </div>
  )
}

export default ViewClients
