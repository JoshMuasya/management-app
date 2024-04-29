'use client'

import * as React from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { ScrollArea } from "@/components/ui/scroll-area"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

import Link from "next/link"

import { addDays, format, subMonths } from "date-fns"
import { ArrowLeftCircle, Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Expenses, FinanceClientData } from '@/interface'
import { collection, getDocs } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"

export function ViewExpensesCard() {
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [expensesArray, setExpensesArray] = useState<Expenses[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expenses[]>([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  })

  useEffect(() => {
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

    fetchExpensesData()
  }, [])

  console.log("Expenses", expensesArray)

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 24),
    to: addDays(new Date(2024, 1, 24), 0),
  })

  useEffect(() => {
    if (expensesArray.length > 0 && date && date.from !== undefined && date.to !== undefined) {
      const filteredData = expensesArray.filter((expense) => {
        let expenseDate;
        if (expense.dateCreated) {
          // Convert Firestore Timestamp to JavaScript Date
          expenseDate = (expense.dateCreated as any).toDate();
        }
        if (expenseDate && date?.from && date?.to) {
          return expenseDate >= date.from && expenseDate <= date.to;
        }

        return false;
      });
      setFilteredExpenses(filteredData);
    }
  }, [date, expensesArray]);

  console.log("Filtered", filteredExpenses)

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
    <div className="flex flex-col justify-center align-middle items-center w-full">
      <div className='w-full flex flex-col justify-center align-middle items-center'>
        {/* Title */}
        <div className='text-2xl font-bold pb-3'>
          View Expenses
        </div>
        <ResizablePanelGroup
          direction="horizontal"
          className="max-w-full rounded-lg border"
        >
          <ResizablePanel defaultSize={50}>
            <div className="flex h-screen items-center justify-center p-6 flex-col align-middle">
              <div className='font-bold text-xl text-center pb-10'>
                Select Time Period For Expenses Review
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
          <ResizablePanel defaultSize={50}>
            <div className="flex h-fit items-center justify-center p-6 flex-col align-middle">
              <h1 className='font-bold text-lg pb-3'>
                Expenses Records for the period {date?.from && format(date.from, "MMM dd yyyy")} to {date?.to && format(date.to, "MMM dd yyyy")}
              </h1>

              {/* Expenses */}
              <div className='flex flex-col justify-center items-center align-middle'>
                {expensesArray.length > 0 && (
                  <ScrollArea className="h-3/5 w-full rounded-md border">
                    <div className='flex flex-row justify-center align-middle items-center flex-wrap'>
                      {filteredExpenses.map((expense, index) => {
                        return (
                          <Card
                            className="w-full max-w-sm m-3"
                            key={index}
                          >
                            <CardHeader>
                              <CardTitle>{expense.name}</CardTitle>
                              <CardDescription>{expense.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div>
                                <strong>Amount: </strong> {expense.amount}
                              </div>

                              <div>
                                <strong>Date: </strong> {expense.dateCreated ? (
                                  // Check if expense.dateCreated is a standard Date object
                                  expense.dateCreated instanceof Date
                                    ? expense.dateCreated.toLocaleDateString()
                                    : new Date(expense.dateCreated.seconds * 1000).toLocaleDateString()
                                ) : null}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className='w-full items-start pt-5 pl-10'>
        <Link
          href='/finances'
          className={`${buttonVariants({ variant: "default" })} px-5 text-xl font-bold fixed bottom-14`}
        >
          <ArrowLeftCircle />
        </Link>
      </div>
    </div>
  )
}
