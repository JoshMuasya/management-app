'use client'

import { DataTable } from '@/components/table/Table'
import { columns } from '@/components/table/column'
import { db } from '@/lib/firebase'
import { ClientFormData } from '@/interface'
import { collection, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

const ViewClients = () => {
  const [data, setData] = useState<ClientFormData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const collectionRef = collection(db, "Clients");

      const querySnapshot = await getDocs(collectionRef);

      const newData: ClientFormData[] = []

      querySnapshot.forEach((doc) => {
        const dataFromDoc = doc.data() as ClientFormData;
        newData.push({ ...dataFromDoc });
      });

      setData(newData);
    };

    fetchData();
  }, [])

  console.log(data)

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
