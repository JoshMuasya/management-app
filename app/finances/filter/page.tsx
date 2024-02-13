import React from 'react'
import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { buttonVariants } from "@/components/ui/button"

const Filter = () => {
  return (
    <div className='pt-28 pb-10 px-10 flex flex-col justify-center align-middle items-center'>
      {/* TOPIC */}
      <div>
        LAW FIRM FINANCES
      </div>

      {/* Card */}
      <div>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>View Overall Finances</CardTitle>
            <CardDescription>View Finances Or Add Expenses</CardDescription>
          </CardHeader>
          <CardContent>

          </CardContent>
          <CardFooter className="flex justify-between">
            <Link
              className={buttonVariants({ variant: "default" })}
              href='/finances/filter/review'
            >
              VIEW
            </Link>

            <Link
              className={buttonVariants({ variant: "secondary" })}
              href='/finances/filter/expenses'
            >
              EXPENSES
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Filter
