"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button, buttonVariants } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import { addDoc, collection } from "firebase/firestore"
import { useEffect, useState } from "react"
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeftCircle, Loader2 } from "lucide-react"
import Link from "next/link"

const FormSchema = z.object({
    fullname: z.string().min(2, {
        message: "FullName must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Invalid email address.",
    }),
    phonenumber: z.string().min(10, {
        message: "Phone Number must be at least 10 characters.",
    }),
    rank: z.string({
        required_error: "Select a Rank"
    }),
    department: z.string({
        required_error: "Select a Department"
    }),
    lawyerId: z.string().min(5, {
        message: "Input ID Number",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const addError = () => toast('Please try Again...');
const userAdded = () => toast('User Added Successfully...');

export function SignUp() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoading(false);
            if (!user) {
                router.replace('/auth/login');
            } else {
                const uid = user.uid
            }
        });

        return () => {
            unsubscribe();
        };
    }, [router]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            fullname: "",
            email: "",
            phonenumber: "",
            rank: "",
            department: "",
            lawyerId: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

            const { user } = userCredential;
            const { uid } = user;

            console.log("UID:", uid)

            await addDoc(collection(db, "Users"), {
                uid: uid,
                fullname: data.fullname,
                email: data.email,
                phonenumber: data.phonenumber,
                rank: data.rank,
                department: data.department,
                lawyerId: data.lawyerId,
            });

            console.log("Data:", data)

            form.reset();
            setIsLoading(false);

            userAdded();
        } catch (error) {
            console.log(error)
            setIsLoading(false);
            addError();
        }
    }

    return (
        <div className="w-full flex flex-col justify-center items-center align-middle">
            <Card className="w-2/3 flex flex-col justify-center items-center align-middle">
                <CardHeader>
                    <CardTitle>Add Users</CardTitle>
                </CardHeader>
                <CardContent className="w-full flex flex-col justify-center items-center align-middle">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                            {/* FullName */}
                            <FormField
                                control={form.control}
                                name="fullname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>FullName</FormLabel>
                                        <FormControl>
                                            <Input placeholder="FullName" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="example@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* PhoneNumber */}
                            <FormField
                                control={form.control}
                                name="phonenumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="Enter PhoneNumber" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Rank */}
                            <FormField
                                control={form.control}
                                name="rank"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rank</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter user Rank" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Department */}
                            <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Select Department" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* ID */}
                            <FormField
                                control={form.control}
                                name="lawyerId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter ID Number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Confirm Password */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                    Add User
                                </Button>
                            )}
                        </form>
                    </Form>
                </CardContent>

                <Toaster />
            </Card>

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
