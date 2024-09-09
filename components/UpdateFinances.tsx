'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { Button, buttonVariants } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftCircle, Search } from 'lucide-react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ClientFormData, FinanceClientData, FinancesClient, PaymentHistories } from '@/interface'

import { Separator } from "@/components/ui/separator"

import { format } from 'date-fns';

import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link'

const FormSchema = z.object({
    amountPaid: z.string({
        required_error: "Username must be at least 2 characters.",
    }),
    paymentDate: z.date({
        required_error: "Select date of Payment",
    }),
})

const UpdateFinancesCard = () => {
    const [clientArray, setClientArray] = useState<FinancesClient[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedClient, setSelectedClient] = useState<FinanceClientData | null>(null);
    const [filteredData, setFilteredData] = useState(clientArray)
    const [isLoading, setIsLoading] = useState(false)
    const [paymentHistories, setPaymentHistories] = useState<PaymentHistories[]>([])
    const [totalAmountPaidFromHistory, setTotalAmountPaidFromHistory] = useState(0);
    const [filteredHistories, setFilteredHistories] = useState<PaymentHistories[]>([]);

    const addError = () => toast('Please try Again...');
    const updated = () => toast('Payment Updated...');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const collectionRef = collection(db, "Finances");
                const querySnapshot = await getDocs(collectionRef);

                const dataMap: { [key: string]: FinancesClient } = {};

                querySnapshot.forEach((doc) => {
                    const dataFromDoc = doc.data() as FinancesClient;
                    const clientId = dataFromDoc.clientId;
                    const totalAmount = dataFromDoc.totalAmount ? parseInt(dataFromDoc.totalAmount) : 0;

                    if (dataMap[clientId]) {
                        // Ensure totalAmount is a string before adding
                        const existingAmount = dataMap[clientId].totalAmount ? parseInt(dataMap[clientId].totalAmount) : 0;
                        dataMap[clientId].totalAmount = (existingAmount + totalAmount).toString();
                    } else {
                        dataMap[clientId] = { ...dataFromDoc, financeId: doc.id, totalAmount: totalAmount.toString() };
                    }
                });

                const data = Object.values(dataMap);
                setClientArray(data);

            } catch (error) {
                console.error("Failed to fetch:", error);
            }
        };

        const fetchHistory = async () => {
            try {
                const collectionRef = collection(db, "PaymentHistory");

                const querySnapshot = await getDocs(collectionRef);
                const data = querySnapshot.docs.map((doc) => doc.data() as PaymentHistories);

                setPaymentHistories(data);

                // const totalAmountPaid = data.reduce((sum, payment) => sum + parseInt(payment.amountPaid), 0);
                // setTotalAmountPaidFromHistory(totalAmountPaid);
            } catch (error) {
                console.error("Failed to fetch:", error);
            }
        }

        fetchData();
        fetchHistory();
    }, []);

    console.log("Payment Histories", paymentHistories)
    console.log("Total Amount", totalAmountPaidFromHistory)

    useEffect(() => {
        if (selectedClient) {
            // Filter payment histories based on the selected client's clientId
            const filteredHistories = paymentHistories.filter(
                (history) => history.clientId === selectedClient.clientId
            );

            // Calculate the total amount paid
            const totalPaid = filteredHistories.reduce((total, history) => {
                return total + parseInt(history.amountPaid, 10); // Ensure amountPaid is an integer
            }, 0);

            setFilteredHistories(filteredHistories);
            setTotalAmountPaidFromHistory(totalPaid);
        } else {
            setFilteredHistories([]);
            setTotalAmountPaidFromHistory(0);
        }
    }, [selectedClient, paymentHistories]);

    console.log("Filtered Histories", filteredHistories)
    console.log("Total Amount", totalAmountPaidFromHistory)

    const handleSearch = useCallback(() => {
        const result = clientArray.filter((item) =>
            item.clientName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredData(result);
    }, [clientArray, searchQuery]);

    console.log("Filtered Array", filteredData)

    const handleClick = (value: FinancesClient | null) => {
        setSelectedClient(value)
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            amountPaid: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (selectedClient) {
            const updatedData = {
                ...data,
                clientId: selectedClient.clientId,
                clientName: selectedClient.clientName,
                totalAmount: selectedClient.totalAmount,
            };

            console.log("Submitted Data", updatedData);

            const paymentCollection = collection(db, 'PaymentHistory');

            const paymentData = await addDoc(paymentCollection, updatedData);

            // Reset the form after successful submission
            form.reset();

            // Trigger a success toast notification
            updated();

            window.location.reload();

            setIsLoading(true);

        } else {
            addError();
        }
    };

    const formattedDate = (timestamp: { seconds: number; nanoseconds: number } | Date | undefined) => {
        if (timestamp instanceof Date) {
            return `${timestamp.getMonth() + 1}/${timestamp.getDate()}/${timestamp.getFullYear()}`;
        } else if (timestamp) {
            const date = new Date(timestamp.seconds * 1000);
            return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        }
        return "Invalid date";
    };

    const totalAmount = selectedClient ? parseInt(selectedClient.totalAmount || "0") : 0;
    const totalAmountPaid = selectedClient && selectedClient.paymentHistory ? Object.values(selectedClient.paymentHistory).reduce((acc, val) => acc + parseInt(val), 0) : 0;
    const balance = totalAmount - totalAmountPaidFromHistory;

    // Filter the payment histories relevant to the selected client
    // const filteredPaymentHistories = paymentHistories.filter(history => history.clientId === selectedClient?.clientId);


    return (
        <div className="flex flex-col justify-center align-middle items-center w-full">
            <div className="p-10">
                <Card className="lg:w-[500px] w-[350px]">
                    <CardHeader>
                        <CardTitle>Update Client Financial Details</CardTitle>
                        <CardDescription>Search for client to update Financial details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Search */}
                        <div className='flex flex-row justify-center align-middle items-center'>
                            <div className='pr-10'>
                                <Input
                                    placeholder="Search Client by Name"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div>
                                <Button variant="outline" size="icon">
                                    <Search
                                        className="h-4 w-4"
                                        onClick={handleSearch}
                                    />
                                </Button>
                            </div>
                        </div>

                        {/* Select */}
                        <div className='pt-5'>
                            <Select
                                onValueChange={(value) => {
                                    const selected = filteredData.find(client => client.clientId === value) || null;
                                    handleClick(selected);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Client" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {filteredData.length === 0 ? (
                                            <p>No matching clients found</p>
                                        ) : (
                                            filteredData.map((client) => (
                                                <SelectItem
                                                    key={client.clientId}
                                                    value={client.clientId}
                                                >
                                                    {client.clientName}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                        </div>
                    </CardContent>

                    <hr
                        className='w-full pb-5'
                    />

                    <CardContent
                        className='flex flex-col justify-center items-center align-middle'
                    >
                        <Label className='text-lg pb-5'>
                            {selectedClient ? selectedClient.clientName : "No client selected"}
                        </Label>

                        {/* Form */}

                    </CardContent>

                    <CardContent className='flex flex-col justify-center align-middle items-center'>
                        <div className="flex h-5 items-center space-x-4 text-sm pb-5">
                            <div>Total Amount</div>
                            <Separator orientation="vertical" />
                            <div>
                                {selectedClient ? selectedClient.totalAmount : "No client selected"}
                            </div>
                        </div>

                        <div className="flex h-5 items-center space-x-4 text-sm">
                            <div>Date Created</div>
                            <Separator orientation="vertical" />
                            <div>
                                {selectedClient && selectedClient.dateCreated
                                    ? formattedDate(selectedClient.dateCreated)
                                    : "No client selected"}
                            </div>
                        </div>
                    </CardContent>

                    <CardContent className="flex flex-col justify-center align-middle items-center text-base">
                        <div className="flex flex-col justify-center align-middle items-start text-base pb-5">
                            {/* Title */}
                            <Label className="pb-5 text-2xl font-bold">
                                Payment History
                            </Label>

                            <div className="flex h-5 items-center space-x-4 text-xl pb-5 font-bold">
                                <div>Dates</div>
                                <Separator orientation="vertical" />
                                <div>Amount</div>
                            </div>

                            {filteredHistories.length > 0 ? (
                                <div className='w-full'>
                                    {filteredHistories.map((history, index) => (
                                        <div key={index} className="flex h-5 items-center space-x-4 text-sm py-5">
                                            <div className='font-medium'>{formattedDate(history.paymentDate)}</div>
                                            <Separator orientation="vertical" />
                                            <div>{history.amountPaid}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No payment history available</p>
                            )}

                            <div className="flex h-5 items-center space-x-4 text-sm pb-5 pt-12 font-bold">
                                <div>Total Paid</div>
                                <Separator orientation="vertical" />
                                <div>{selectedClient ? totalAmountPaidFromHistory : 0}</div>
                            </div>

                            <div className="flex h-5 items-center space-x-4 text-sm pb-5 pt-5 font-bold italic">
                                <div>Balance</div>
                                <Separator orientation="vertical" />
                                <div>{selectedClient ? balance : 0}</div>
                            </div>
                        </div>

                        {/* Form */}
                        {balance !== 0 && (
                            <div className="pt-5">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="paymentDate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Select Date of Payment</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-[240px] pl-3 text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(field.value, "PPP")
                                                                    ) : (
                                                                        <span>Pick a date</span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                disabled={(date) =>
                                                                    date > new Date() || date < new Date("1900-01-01")
                                                                }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="amountPaid"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input placeholder="amount" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit">Add Payment</Button>
                                    </form>
                                </Form>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Toaster />
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

export default UpdateFinancesCard
