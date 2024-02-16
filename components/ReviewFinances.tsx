'use client'

import React, { useEffect, useState } from 'react'
import { DatePickerWithRange } from './DatePicker'
import Link from 'next/link'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

import { buttonVariants } from "@/components/ui/button"

import { ScrollArea } from "@/components/ui/scroll-area"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

import { addDays, format, subMonths } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Expenses, FinanceClientData } from '@/interface'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const ReviewFinances = () => {
  const [financesArray, setFianancesArray] = useState<FinanceClientData[]>([])
  const [expensesArray, setExpensesArray] = useState<Expenses[]>([])

  useEffect(() => {
    const fetchFianacialData = async () => {
      const financeCollection = collection(db, "Finances");

      const querySnapshot = await getDocs(financeCollection)

      const data: FinanceClientData[] = []

      querySnapshot.forEach((doc) => {
        const dataFromDoc = doc.data() as FinanceClientData;
        data.push({ ...dataFromDoc })
      })

      setFianancesArray(data)
    }

    const fetchExpensesData = async () => {
      const expenseCollection = collection(db, "Expenses");

      const querySnapshot = await getDocs(expenseCollection)

      const expensedata: Expenses[] = []

      querySnapshot.forEach((doc) => {
        const dataFromDoc = doc.data() as Expenses;
        expensedata.push({ ...dataFromDoc })
      })

      setExpensesArray(expensedata)
    }

    fetchFianacialData()
    fetchExpensesData()
  }, [])

  console.log(financesArray)

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 24),
    to: addDays(new Date(2024, 1, 24), 0),
  })

  const handleSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate)

    if (selectedDate) {
      console.log("Selected Dates:", selectedDate.from, selectedDate.to)
    }
  }

  // Handle 3 Months
  const handleLast3Months = () => {
    const today = new Date();
    const fromDate = subMonths(today, 3);
    const toDate = today;
    setDate({ from: fromDate, to: toDate });
  };

  // Handle 6 Months
  const handleLast6Months = () => {
    const today = new Date();
    const fromDate = subMonths(today, 6);
    const toDate = today;
    setDate({ from: fromDate, to: toDate });
  };

  // Handle 12 Months
  const handleLast1Year = () => {
    const today = new Date();
    const fromDate = subMonths(today, 12);
    const toDate = today;
    setDate({ from: fromDate, to: toDate });
  };

  // Handle 60 Months
  const handleLast5Years = () => {
    const today = new Date();
    const fromDate = subMonths(today, 60);
    const toDate = today;
    setDate({ from: fromDate, to: toDate });
  };

  // Handle 120 Months
  const handleLast10Years = () => {
    const today = new Date();
    const fromDate = subMonths(today, 120);
    const toDate = today;
    setDate({ from: fromDate, to: toDate });
  };

  return (
    <div className='w-full flex flex-col justify-center align-middle items-center'>
      {/* Title */}
      <div className='text-2xl font-bold pb-3'>
        View Financial Records
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-full rounded-lg border"
      >
        <ResizablePanel defaultSize={40}>
          <div className="flex h-screen items-center justify-center p-6 flex-col align-middle">
            <div className='font-bold text-xl text-center pb-10'>
              Select Time Period For Finances Review
            </div>

            <div className='pb-5'>
              <div className='flex flex-col justify-center align-middle items-center'>
                <div className={cn("grid gap-2")}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-[300px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className='flex flex-col justify-center align-middle items-center'>
              <Button
                className='my-3'
                onClick={handleLast3Months}
              >Last 3 Months</Button>
              <Button
                className='my-3'
                onClick={handleLast6Months}
              >Last 6 Months</Button>
              <Button
                className='my-3'
                onClick={handleLast1Year}
              >Last 1 Year</Button>
              <Button
                className='my-3'
                onClick={handleLast5Years}
              >Last 5 Years</Button>
              <Button
                className='my-3'
                onClick={handleLast10Years}
              >Last 10 Years</Button>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-fit items-center justify-center p-6 flex-col align-middle">
                <h1 className='font-bold text-lg pb-3'>
                  Financial Records for the period {date?.from && format(date.from, "MMM dd yyyy")} to {date?.to && format(date.to, "MMM dd yyyy")}
                </h1>

                {/* Clients */}
                <div className='flex flex-col justify-center items-center align-middle'>
                  <h2 className='font-bold text-base pb-3'>
                    Clients with pending Bills
                  </h2>

                  <ScrollArea className="h-64 w-full rounded-md border">
                    <div className='flex flex-row justify-center align-middle items-center flex-wrap'>
                      {financesArray.map((finance, index) => {
                        // Check if finance.totalAmount is defined and it's a valid number
                        if (finance.totalAmount && !isNaN(parseFloat(finance.totalAmount))) {
                          // Convert finance.totalAmount to a number
                          const totalAmount = parseFloat(finance.totalAmount);

                          // Calculate total payment from payment history
                          const totalPayment = Object.values(finance.paymentHistory ?? {}).reduce((acc, amount) => acc + parseFloat(amount), 0);

                          // Calculate balance
                          const balance = totalAmount - totalPayment;

                          return (
                            <Card key={index} className="w-[250px] m-5">
                              <CardHeader>
                                <CardTitle>{finance.clientName}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <h3 className='pb-3'>
                                  <span className='font-bold text-lg'>Total Amount:</span> {totalAmount}
                                </h3>

                                <h2 className="font-bold text-base pb-1">Payment History</h2>
                                <ul>
                                  {Object.entries(finance.paymentHistory ?? {}).map(([date, amount]) => (
                                    <li key={date}>
                                      <strong>{date}:</strong> {amount}
                                    </li>
                                  ))}
                                </ul>

                                <h3 className='pt-3'>
                                  <span className='font-bold text-lg'>Balance:</span> {balance}
                                </h3>
                              </CardContent>
                            </Card>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  </ScrollArea>

                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6 flex-col align-middle">
                <h1 className='font-bold text-lg pb-3'>
                  Revenue, Expenses, Profit & Loss
                </h1>

                <div>
                  <Tabs defaultValue="account" className="w-fit">
                    <TabsList>
                      <TabsTrigger value="revenue">Revenue</TabsTrigger>
                      <TabsTrigger value="expenses">Expenses</TabsTrigger>
                      <TabsTrigger value="profit">Profit & Loss</TabsTrigger>
                    </TabsList>
                    <TabsContent value="revenue">
                      <h1 className='font-bold text-base pb-3'>
                        Total Revenue
                      </h1>

                      <div>
                        <Card className="w-[350px]">
                          <CardHeader>
                            <CardDescription>Total revenue as from 24 Jan 2024 to 24 Feb 2024</CardDescription>
                          </CardHeader>
                          <CardContent>
                            Total Revenue: 20000000
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    <TabsContent value="expenses">
                      <h1 className='font-bold text-base pb-3'>
                        Total Expenses
                      </h1>

                      <div>
                        <Card className="w-[350px]">
                          <CardHeader>
                            <CardDescription>Total expenses as from 24 Jan 2024 to 24 Feb 2024</CardDescription>
                          </CardHeader>
                          <CardContent>
                            Total Expenses: 500000
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    <TabsContent value="profit">
                      <h1 className='font-bold text-base pb-3'>
                        Total Profit
                      </h1>

                      <div>
                        <Card className="w-[350px]">
                          <CardHeader>
                            <CardDescription>Total profit as from 24 Jan 2024 to 24 Feb 2024</CardDescription>
                          </CardHeader>
                          <CardContent>
                            Total Revenue: 1500000
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default ReviewFinances
