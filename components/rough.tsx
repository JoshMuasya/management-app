import React from 'react'
import { DatePickerWithRange } from './DatePicker'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ReviewFinances = () => {
  return (
    <div className='flex flex-col justify-center items-center align-middle'>
      <Card className="w-2/3 flex flex-col justify-center items-center align-middle">
        <CardHeader>
          <CardTitle>Select Time Period For Finances Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col justify-center align-middle items-center'>
            <DatePickerWithRange />
          </div>
        </CardContent>

        <CardContent>
          {/* Title */}
          <div>
            Financial Records for the period Jan 24 2024 to Feb 24 2024
          </div>

          {/* Content */}
          <div>
            Total Revenue: 20000000
          </div>

          <div>
            Total Expenses: 500000
          </div>

          <div>
            <div>
              Pending Invoices
            </div>

            <div>
              <li>Jane Doe: 500000</li>
              <li>John Doe: 1000000</li>
              <li>James Doe: 200000</li>
            </div>
          </div>

          <div>
            Profit: 1500000
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">

        </CardFooter>
      </Card>
    </div>
  )
}

export default ReviewFinances
