"use client"

import { FinanceClientData } from '@/interface'
import { db } from '@/lib/firebase'
import { useFinanceStore } from '@/store/store'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ClientInvoice = () => {
  const [financeData, setFinanceData] = useState<FinanceClientData | null>(null)

  const [client] = useFinanceStore((state) => [
    state.client
  ])

  console.log('Client:', client)

  const clientID = client

  useEffect(() => {
    const fetchData = async () => {
      const collectionRef = collection(db, 'Finances')

      console.log('Client ID:', clientID)

      const q = query(collectionRef, where('clientId', '==', clientID));

      try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const financialData = querySnapshot.docs[0].data() as FinanceClientData;
          setFinanceData(financialData)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchData()
  }, [clientID])

  useEffect(() => {
    if (financeData) {
      window.print();
      window.history.back();
    }
  }, [financeData]);

  return (
    <div className='flex flex-col justify-center items-center align-middle pt-24 pb-12 w-full px-5'>
      {/* Feenote */}
      <h4 className='text-base italic text-right w-full'>
        Invoice No
      </h4>

      {/* Company Name */}
      <div className='text-3xl font-bold text-center'>
        DIGIMATIC MARKETERS
      </div>

      {/* Address */}
      <div className='flex flex-col justify-center items-center align-middle pt-5'>
        {/* Title */}
        <h2 className='text-base font-bold text-center'>
          Address
        </h2>

        {/* Physical Address */}
        <h4 className='flex flex-row justify-between align-middle items-center text-center italic text-sm'>
          Westlands Commercial Center
          <span className='pl-5'>Block B, 1st Floor Room 3</span>
        </h4>

        <h4 className='italic text-sm'>
          P.O. Box 37090-00623
        </h4>

        <h4 className='italic text-sm'>
          +254 798 040 353
        </h4>
      </div>

      {/* Contents */}
      <div className='w-full flex flex-col align-middle justify-center text-base pt-10'>
        <p className='pb-5'>
          Professional/Legal fees are as follows:-
        </p>

        {/* Card */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Fees</CardTitle>
            <CardDescription>{`Fees for ${financeData?.clientName}`}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col justify-center align-middle items-center w-full'>
              {/* Header */}
              <div className='flex flex-row justify-between align-middle items-center font-bold text-2xl w-full px-5'>
                <h1>
                  Fees
                </h1>

                <h1>
                  Amount (Ksh)
                </h1>
              </div>

              {/* Total */}
              <div className='flex flex-row justify-between align-middle items-center font-bold text-xl w-full px-5 pt-3'>
                <h1>
                  Total Fees
                </h1>

                <h1>
                  {financeData?.totalAmount}
                </h1>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className='py-5'>
          Payment to be made to the following account:-
        </p>

        {/* Payment Details */}
        <Card>
          <CardContent>
            <div className='flex flex-col justify-center align-middle items-center w-full'>
              {/* Body */}
              <div className='flex flex-row justify-between align-middle items-center text-base w-full px-5 pt-3'>
                <p className='font-bold'>
                  Name of Account
                </p>

                <p>
                  Digimatic Marketers
                </p>
              </div>

              <div className='flex flex-row justify-between align-middle items-center text-base w-full px-5'>
                <p className='font-bold'>
                  Account No.
                </p>

                <p>
                  2043468875
                </p>
              </div>

              <div className='flex flex-row justify-between align-middle items-center text-base w-full px-5'>
                <p className='font-bold'>
                  Bank
                </p>

                <p>
                  Absa Bank Kenya
                </p>
              </div>

              <div className='flex flex-row justify-between align-middle items-center text-base w-full px-5'>
                <p className='font-bold'>
                  Branch
                </p>

                <p>
                  Westlands Branch
                </p>
              </div>

              <div className='flex flex-row justify-between align-middle items-center text-base w-full px-5'>
                <p className='font-bold'>
                  Currency
                </p>

                <p>
                  Kenya Shilling
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className='text-base py-5'>
          Feel free to contact us for any clarifications.
        </p>

        <div className='flex flex-row justify-center align-middle items-center text-base'>
          <p className='font-bold pr-5'>
            Phone Number:
          </p>

          <p>
            +254 798 040 353
          </p>
        </div>
      </div>
    </div>
  )
}

export default ClientInvoice
