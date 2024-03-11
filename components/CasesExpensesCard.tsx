'use client'

import { useEffect, useState } from "react"

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

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { ArrowLeftCircle, Loader2, Search } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast';
import { useAppStore } from "@/store/store"
import { onAuthStateChanged } from "firebase/auth"
import { CasesFormData, CasesType, UserData } from "@/interface"
import Link from "next/link"
import { Label } from "./ui/label"

const FormSchema = z.object({
    totalAmount: z.string({
        required_error: "Total Amount is Required",
    }),
    dateCreated: z.date({
        required_error: "Date is required.",
    })
})

const addError = () => toast('Please try Again...');

const CasesExpensesCard = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const [userData, setUserData] = useState<UserData>({});
    const [caseData, setCaseData] = useState<CasesFormData[]>([]);
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredData, setFilteredData] = useState(caseData)
    const [selectedCase, setSelectedCase] = useState<CasesFormData | null>(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                fetchUserData(uid)
            } else {
                router.replace('/auth/login');
            }
        })
    }, [router])

    const fetchUserData = async (uid: string) => {
        const usersCollection = collection(db, "Users");

        const q = query(usersCollection, where('uid', '==', uid))

        try {
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data() as UserData;
                setUserData(userData);
            } else {
                addError();
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    useEffect(() => {
        const fetchCaseData = async () => {
            try {
                const collectionRef = collection(db, "Cases");

                const querySnapshot = await getDocs(collectionRef);

                const data: CasesFormData[] = []

                querySnapshot.forEach((doc) => {
                    const dataFromDoc = doc.data() as CasesFormData;
                    data.push({ ...dataFromDoc })
                })

                setCaseData(data)
            } catch (error) {
                console.error("Failed to fetch", error)
            }
        }

        fetchCaseData()
    }, [])

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            totalAmount: "",
        },
    })

    const handleSearch = () => {
        const result = caseData.filter((item) =>
            item.caseName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredData(result)
    }

    const handleClick = (value: CasesFormData | null) => {
        setSelectedCase(value)
    }

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const name = selectedCase?.caseNo
        const desc = selectedCase?.caseName
        const loggedBy = userData?.fullname

        try {
            if (name && desc && loggedBy) {
                const expensesCollection = collection(db, 'Expenses');

                const expenseData = await addDoc(expensesCollection, {
                    name: name,
                    description: desc,
                    loggedBy: loggedBy,
                    ...data
                });

                setIsLoading(true)

                form.reset();
            } else {
                console.log('Name or Desc or LoggedBy is not available')
            }
        } catch(error) {
            console.error("Failed please try again", error)
        }
    }

    return (
        <div className="w-full flex flex-col justify-center items-center align-middle">
            <div>
                <Card className="lg:w-[500px] w-[350px]">
                    <CardHeader>
                        <CardTitle>Add Cases Expenses</CardTitle>
                        <CardDescription>Search for case to add Expenses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Search */}
                        <div className='flex flex-row justify-center align-middle items-center'>
                            <div className='pr-10'>
                                <Input
                                    placeholder="Search Case by Name"
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
                                    const selected = caseData.find(caseItem => caseItem.caseNo === value) || null;
                                    handleClick(selected);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Case" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {filteredData.length === 0 ? (
                                            <p>No matching cases found</p>
                                        ) : (
                                            filteredData.map((caseItem) => (
                                                <SelectItem
                                                    key={caseItem.caseNo}
                                                    value={caseItem.caseNo}
                                                >
                                                    {caseItem.caseName}
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
                            {selectedCase ? selectedCase.caseName : "No Case Selected"}
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
                                            <FormLabel>Date</FormLabel>
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

            <div className='w-full items-start pt-5'>
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

export default CasesExpensesCard
