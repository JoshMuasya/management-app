'use client'

import React, { useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Button, buttonVariants } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Link from 'next/link'
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'

import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation'


const FormSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    })
})

const sentLink = () => toast('Reset Link Sent to your Email Address...');
const errorSending = () => toast('Email not sent Please check the Email and try again!!!');
const emailNotFound = () => toast('Email not found!!!');

const Reset = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const email = data.email.toLowerCase();

        try {
            await sendPasswordResetEmail(auth, email);
            // Email sent successfully
            sentLink();

            router.push('/auth/login')
        } catch (error) {
            errorSending();
        }
    }

    return (
        <div className='flex flex-col justify-center items-center align-middle h-screen'>
            <Card className="w-[500px]">
                <CardHeader>
                    <CardTitle>Enter Email linked to your Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-row justify-between align-middle items-center pt-3">
                                {/* Login Button */}
                                {isLoading ? (
                                    <Button disabled>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className="font-bold text-base hover:italic"
                                    >
                                        Submit
                                    </Button>
                                )}

                                {/* Cancel */}
                                <Link
                                    href='/auth/login'
                                    className={buttonVariants({ variant: "outline" })}
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Toaster />
        </div>
    )
}

export default Reset
