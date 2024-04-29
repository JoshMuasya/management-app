'use client'

import React, { useEffect, useState } from 'react'

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

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ClientFormData } from '@/interface'
import toast, { Toaster } from 'react-hot-toast';

import { jsPDF } from 'jspdf';
import { useRouter } from 'next/navigation'
import { useFinanceStore } from "@/store/store"
import Link from 'next/link'

const FormSchema = z.object({
    totalAmount: z.string({
        required_error: "Total Amount is Required",
    }),
    dateCreated: z.date({
        required_error: "Date is required.",
    }),
})

const AddFinancesForm = () => {
    const [clientArray, setClientArray] = useState<ClientFormData[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredData, setFilteredData] = useState(clientArray)
    const [selectedClient, setSelectedClient] = useState<ClientFormData | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const [client, setClient] = useFinanceStore((state) => [
        state.client,
        state.setClient
    ])

    const addError = () => toast('Please try Again...');

    const handleSearch = () => {
        const result = clientArray.filter((item) =>
            item.clientName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredData(result);
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            totalAmount: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const clientId = selectedClient?.clientId
        const clientName = selectedClient?.clientName

        console.log("Submitted Data", clientId, clientName, data)

        try {
            if (clientId && clientName) {
                const financesCollection = collection(db, 'Finances');

                const financialData = await addDoc(financesCollection, {
                    clientId: clientId,
                    clientName: clientName,
                    ...data,
                });

                setIsLoading(true);

                console.log(financialData);

                setClient(clientId)

                router.push(`/finances/add/invoice?clientId=${clientId}`)
            } else {
                console.error('clientId or clientName is not available');
            }
        } catch (error) {
            addError()
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const collectionRef = collection(db, "Clients");

                const querySnapshot = await getDocs(collectionRef)

                const data: ClientFormData[] = []

                querySnapshot.forEach((doc) => {
                    const dataFromDoc = doc.data() as ClientFormData;
                    data.push({ ...dataFromDoc })
                });

                setClientArray(data)
            } catch (error) {
                console.error("Failed to fetch", error)
            }
        }

        fetchData()
    }, [])

    const handleClick = (value: ClientFormData | null) => {
        setSelectedClient(value)
    }

    return (
        <div className="flex flex-col justify-center align-middle items-center w-full">
            <div className='pt-5 pb-10 px-10'>
                <Card className="lg:w-[500px] w-[350px]">
                    <CardHeader>
                        <CardTitle>Add Financial Details</CardTitle>
                        <CardDescription>Search for client to add Financial details</CardDescription>
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
                                    const selected = clientArray.find(client => client.clientId === value) || null;
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
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="totalAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Amount</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Total Amount" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dateCreated"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date Created</FormLabel>
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
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit">Add</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
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

export default AddFinancesForm
