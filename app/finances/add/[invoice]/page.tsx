"use client"

import { FinanceClientData } from '@/interface'
import { db, storage } from '@/lib/firebase'
import { useFinanceStore } from '@/store/store'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import React, { useCallback, useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSearchParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import jsPDF from 'jspdf'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const ClientInvoice = () => {
  const [financeData, setFinanceData] = useState<FinanceClientData[] | null>(null)
  const searchParams = useSearchParams()
  const date = searchParams.get('date')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invoiceNumber, setInvoiceNumber] = useState<string>('')
  
  console.log('Date:', date)

  const [client] = useFinanceStore((state) => [
    state.client
  ])

  console.log('Client:', client)

  const clientID = client

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      const collectionRef = collection(db, 'Finances')

      console.log('Client ID:', clientID)

      const q = query(collectionRef, where('clientId', '==', clientID))

      try {
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const financialData = querySnapshot.docs.map(doc => doc.data() as FinanceClientData)
          setFinanceData(financialData)
        } else {
          setError('No finance data found for this client.')
        }
      } catch (error) {
        setError('Error fetching user data. Please try again.')
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Generate unique invoice number
    const uniqueInvoiceNumber = generateInvoiceNumber()
    setInvoiceNumber(uniqueInvoiceNumber)
  }, [clientID])

  const generateInvoiceNumber = () => {
    const uuid = uuidv4()
    const timestamp = new Date().getTime()
    return `INV-${timestamp}-${uuid}`
  }

  console.log(financeData)

  // Convert URL date and Firestore timestamp to comparable format
  const filteredFinanceData = financeData?.filter(data => {
    if (!date) return false

    const urlDate = new Date(date)
    const dataDate = isFirestoreTimestamp(data.dateCreated) 
      ? new Date(data.dateCreated.seconds * 1000) 
      : new Date(data.dateCreated)

    // Compare only the date parts
    return (
      dataDate.getFullYear() === urlDate.getFullYear() &&
      dataDate.getMonth() === urlDate.getMonth() &&
      dataDate.getDate() === urlDate.getDate()
    )
  })

  // Type guard for Firestore timestamp
  function isFirestoreTimestamp(
    date: Date | { seconds: number; nanoseconds: number; }
  ): date is { seconds: number; nanoseconds: number; } {
    return (date as { seconds: number; nanoseconds: number; }).seconds !== undefined;
  }

  console.log(filteredFinanceData)

  const saveInvoiceDetails = useCallback(async () => {
    if (filteredFinanceData && date) {
      try {
        for (const data of filteredFinanceData) {
          const invoiceDetails = {
            invoiceNumber,
            clientName: data.clientName,
            totalAmount: data.totalAmount,
            date: new Date(date).toISOString()
          };
  
          await addDoc(collection(db, "Invoices"), invoiceDetails);
        }
  
        console.log('Invoice details saved successfully');
      } catch (error) {
        console.error('Error saving invoice details:', error)
      }
    }
  }, [filteredFinanceData, invoiceNumber, date])

  useEffect(() => {
    if (financeData) {
      window.print();
      saveInvoiceDetails();
      window.history.back();
    }
  }, [financeData, saveInvoiceDetails]);

  return (
    <div className='flex flex-col justify-center items-center align-middle pt-24 pb-12 w-full px-5'>
      {/* Feenote */}
      <h4 className='text-base italic text-right w-full'>
        Invoice No: <span className='font-bold'>{invoiceNumber}</span>
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
              {filteredFinanceData?.map((data, index) => (
                <div key={index} className='flex flex-row justify-between align-middle items-center font-bold text-xl w-full px-5 pt-3'>
                  <h1>
                    {data.clientName}
                  </h1>
                  <h1>
                    {data.totalAmount}
                  </h1>
                </div>
              ))}
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
