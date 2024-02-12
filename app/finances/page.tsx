import React from 'react'

import { buttonVariants } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from 'next/link'

const Finances = () => {
    return (
        <div className="w-full h-screen flex flex-col justify-center align-middle items-center back-pic-dark bg-fixed bg-cover">
            <div className="z-10 w-full flex flex-col justify-center align-middle items-center mt-24 mb-14">
                <div>
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Financial Records</CardTitle>
                            <CardDescription>Add or Update Financial records for clients</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                            <Link
                                className={buttonVariants({ variant: "default" })}
                                href='/finances/add'
                            >
                                Add
                            </Link>
                            <Link
                                className={buttonVariants({ variant: "secondary" })}
                                href='/finances/update'
                            >
                                Update
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Finances
