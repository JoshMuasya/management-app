"use client"

import { Expenses, FinanceClientData } from '@/interface'
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
import { nanoid } from 'nanoid'
import { Separator } from "@/components/ui/separator"
import { format } from 'date-fns'

const ExpensesInvoice = () => {
    const [expensesArray, setExpensesArray] = useState<Expenses[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const searchParams = useSearchParams()
    const [expensesNumber, setExpensesNumber] = useState<string>('')

    // Get the 'from' and 'to' dates from the URL query parameters
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    useEffect(() => {
        const fetchData = async () => {
            const collectionRef = collection(db, 'Expenses')

            const querySnapshot = await getDocs(collectionRef)
            const expensedata: Expenses[] = []

            querySnapshot.forEach((doc) => {
                const dataFromDoc = doc.data() as Expenses
                expensedata.push({ ...dataFromDoc })
            })

            // Filter expenses based on the 'from' and 'to' dates
            const filteredExpenses = expensedata.filter((expense) => {
                if (expense.dateCreated) {
                    const expenseDate = (expense.dateCreated as any).toDate() // Convert Firestore Timestamp to Date
                    const fromDate = from ? new Date(from) : null
                    const toDate = to ? new Date(to) : null

                    // Filter by date range
                    if (fromDate && toDate) {
                        return expenseDate >= fromDate && expenseDate <= toDate
                    }
                    return true // If no date range provided, include all
                }
                return false
            })

            // Sort the filtered expenses by date (ascending)
            filteredExpenses.sort((a, b) => {
                const dateA = (a.dateCreated as any).toDate()
                const dateB = (b.dateCreated as any).toDate()
                return dateA.getTime() - dateB.getTime()
            })

            setExpensesArray(filteredExpenses)
            setIsLoading(false)
        }

        fetchData();

        const uniqueExpensesNumber = generateExpensesNumber()
        setExpensesNumber(uniqueExpensesNumber)
    }, [from, to])

    const generateExpensesNumber = () => {
        const timestamp = new Date().getTime()
        const shortId = nanoid(4)
        return `EXP-${timestamp}-${shortId}`
    }

    function isFirestoreTimestamp(
        date: Date | { seconds: number; nanoseconds: number; }
    ): date is { seconds: number; nanoseconds: number; } {
        return (date as { seconds: number; nanoseconds: number; }).seconds !== undefined;
    }

    const saveExpensesDetails = useCallback(async () => {
        if (expensesArray) {
            try {
                for (const data of expensesArray) {
                    const expenseDetails = {
                        expensesNumber,
                        expenseName: data.name,
                        expenseDescription: data.description,
                        expenseAmount: data.amount
                    };

                    await addDoc(collection(db, "ExpensesPrint"), expenseDetails);
                }

                console.log('Invoice details saved successfully');
            } catch (error) {
                console.error('Error saving invoice details:', error)
            }
        }
    }, [expensesArray, expensesNumber])

    useEffect(() => {
        if (!isLoading && expensesArray.length > 0) {
            window.print();
            saveExpensesDetails();
            setTimeout(() => {
                window.history.back();
            }, 1000);
        }
    }, [isLoading, expensesArray, saveExpensesDetails]);

    return (
        <div className='flex flex-col justify-center items-center align-middle pt-24 pb-12 w-full px-5'>
            {/* Feenote */}
            <h4 className='text-base italic text-right w-full'>
                Expenses No: <span className='font-bold'>{expensesNumber}</span>
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
                    Expenses from {from ? format(new Date(from), "MMM dd, yyyy") : "N/A"} to {to ? format(new Date(to), "MMM dd, yyyy") : "N/A"}:
                </p>

                {/* Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-col justify-center align-middle items-center w-full'>
                            {/* Header */}
                            <div className='flex flex-row justify-between align-middle items-center font-bold text-2xl w-full px-5'>
                                <h1>
                                    Expense Name
                                </h1>

                                <h1>
                                    Amount (Ksh)
                                </h1>
                            </div>

                            {/* Separator */}
                            <Separator />

                            {/* Expenses List */}
                            {expensesArray.map((expense, index) => (
                                <div
                                    key={index}
                                    className='flex flex-row justify-between align-middle items-center font-bold text-xl w-full px-5 py-5'>
                                    <div className='flex flex-col justify-center align-middle items-start'>
                                        <h1>{expense.name}</h1>
                                        <p>{expense.description}</p>
                                    </div>
                                    <h1>{expense.amount}</h1>
                                </div>
                            ))}

                            {/* Separator */}
                            <Separator />

                            {/* Total */}
                            <div className='flex flex-row justify-between align-middle items-center font-bold text-xl w-full px-5 pt-5'>
                                <h1>Total</h1>
                                <h1>
                                    {expensesArray.reduce((total, expense) => total + parseFloat(expense.amount), 0).toString()}
                                </h1>
                            </div>


                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ExpensesInvoice
