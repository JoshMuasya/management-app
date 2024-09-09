'use client'

import React from 'react'

import { Button, buttonVariants } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from 'next/link'
import { ArrowLeftCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Finances = () => {
    const loading = () => toast('Loading...');

    return (
        <div className="w-full h-screen flex flex-col justify-center align-middle items-center back-pic-dark bg-fixed bg-cover">
            <div className="z-10 w-full flex flex-row flex-wrap justify-center align-middle items-center mt-24 mb-14">
                <div className='p-3'>
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Financial Records</CardTitle>
                            <CardDescription>Add or Update Financial records for clients</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                            <Button
                                asChild
                                variant="default"
                                onClick={loading}
                            >
                                <Link href="/finances/add">Add</Link>
                            </Button>

                            <Button
                                asChild
                                variant="secondary"
                                onClick={loading}
                            >
                                <Link href="/finances/update">Update</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className='p-3'>
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Expenses</CardTitle>
                            <CardDescription>Add or View Expenses</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                            <Button
                                asChild
                                variant="default"
                                onClick={loading}
                            >
                                <Link href="/finances/expenses">Add</Link>
                            </Button>

                            <Button
                                asChild
                                variant="secondary"
                                onClick={loading}
                            >
                                <Link href="/finances/expenses/view">View</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className='p-3'>
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Cases Expenses</CardTitle>
                            <CardDescription>Add Expenses related to Cases</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                            <Button
                                asChild
                                variant="default"
                                onClick={loading}
                            >
                                <Link href="/finances/expenses/caseexpenses">Add</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <div className='w-full items-start pt-5 pl-10'>
                <Link
                    href='/home'
                    className={`${buttonVariants({ variant: "default" })} px-5 text-xl font-bold fixed bottom-14`}
                >
                    <ArrowLeftCircle />
                </Link>
            </div>
        </div>
    )
}

export default Finances
