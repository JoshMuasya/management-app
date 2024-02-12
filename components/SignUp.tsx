"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
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
import { createUserWithEmailAndPassword } from "firebase/auth"
import { addDoc, collection } from "firebase/firestore"

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


export function SignUp() {
    const router = useRouter();

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
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

            const { password, confirmPassword, ...userDataWithoutPassword } = data;

            const userDocRef = await addDoc(collection(db, 'Users'), {
                uid: userCredential.user.uid,
                data: userDataWithoutPassword,
            });

            console.log('User Added:', userCredential.user)
            console.log('User data stored in Firebase with ID:', userDocRef.id)
        } catch(error) {
            console.error(error)
        }
    }

    return (
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
                        <Button
                            type="submit"
                            className="font-bold text-base hover:italic"
                        >
                            Add User
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
