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
import { ArrowLeftCircle } from 'lucide-react'

const Filter = () => {
  return (
    <div>
      <div className='pt-28 pb-10 px-10 flex flex-col justify-center align-middle items-center'>
        {/* TOPIC */}
        <div className='text-2xl font-bold pb-3'>
          LAW FIRM FINANCES
        </div>

        {/* Card */}
        <div className='flex flex-col justify-center align-middle items-center'>
          <Card className="w-[350px] flex flex-col justify-center align-middle items-center">
            <CardHeader>
              <CardTitle>View Overall Finances</CardTitle>
              <CardDescription>View Finances Or Add Expenses</CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
            <CardFooter className="flex">
              <Link
                className={buttonVariants({ variant: "default" })}
                href='/finances/filter/review'
              >
                VIEW
              </Link>
            </CardFooter>
          </Card>
        </div>
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

export default Filter
