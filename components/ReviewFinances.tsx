import React from 'react'
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

const ReviewFinances = () => {
  return (
    <div className='w-full flex flex-col justify-center align-middle items-center'>
      {/* Title */}
      <div>
        View Financial Records
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-full rounded-lg border"
      >
        <ResizablePanel defaultSize={40}>
          <div className="flex h-screen items-center justify-center p-6 flex-col align-middle">
            <div>
              Select Time Period For Finances Review
            </div>

            <div>
              <div className='flex flex-col justify-center align-middle items-center'>
                <DatePickerWithRange />
              </div>
            </div>

            {/* Presets */}
            <div>
              <h2>Last 3 Months</h2>
              <h2>Last 6 Months</h2>
              <h2>Last 1 Year</h2>
              <h2>Last 5 Years</h2>
              <h2>Last 10 Years</h2>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={25}>
              <div className="flex h-fit items-center justify-center p-6 flex-col align-middle">
                <h1>
                  Financial Records for the period Jan 24 2024 to Feb 24 2024
                </h1>

                {/* Clients */}
                <div className='flex flex-col justify-center items-center align-middle'>
                  <h2>
                    Clients with pending Bills
                  </h2>

                  <ScrollArea className="h-56 w-full rounded-md border">
                    <div className='flex flex-row justify-center align-middle items-center flex-wrap'>
                      <Card className="w-[250px]">
                        <CardHeader>
                          <CardTitle>Create project</CardTitle>
                          <CardDescription>Deploy your new project in one-click.</CardDescription>
                        </CardHeader>
                        <CardContent>

                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Link
                            href=''
                            className={buttonVariants({ variant: "default" })}>
                            Click here
                          </Link>
                        </CardFooter>
                      </Card>

                      <Card className="w-[250px]">
                        <CardHeader>
                          <CardTitle>Create project</CardTitle>
                          <CardDescription>Deploy your new project in one-click.</CardDescription>
                        </CardHeader>
                        <CardContent>

                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Link
                            href=''
                            className={buttonVariants({ variant: "default" })}>
                            Click here
                          </Link>
                        </CardFooter>
                      </Card>

                      <Card className="w-[250px]">
                        <CardHeader>
                          <CardTitle>Create project</CardTitle>
                          <CardDescription>Deploy your new project in one-click.</CardDescription>
                        </CardHeader>
                        <CardContent>

                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Link
                            href=''
                            className={buttonVariants({ variant: "default" })}>
                            Click here
                          </Link>
                        </CardFooter>
                      </Card>
                    </div>
                  </ScrollArea>

                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
              <div className="flex h-full items-center justify-center p-6 flex-col align-middle">
                <h1>
                  Revenue, Expenses, Profit & Loss
                </h1>

                <div>
                  <Tabs defaultValue="account" className="w-[400px]">
                    <TabsList>
                      <TabsTrigger value="revenue">Revenue</TabsTrigger>
                      <TabsTrigger value="expenses">Expenses</TabsTrigger>
                      <TabsTrigger value="profit">Profit & Loss</TabsTrigger>
                    </TabsList>
                    <TabsContent value="revenue">
                      <h1>
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
                      <h1>
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
                      <h1>
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
