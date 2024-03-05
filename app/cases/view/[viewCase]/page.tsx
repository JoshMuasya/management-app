'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { ArrowLeftCircle, Loader2 } from "lucide-react"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { addDoc, collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

import toast, { Toaster } from 'react-hot-toast';
import { CasesType } from '@/interface'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { onAuthStateChanged } from 'firebase/auth'

const ViewCase = ({
  params
}: {
  params: { viewCase: string }
}) => {

  const notify = () => toast('Date Added...');
  const addError = () => toast('Please try Again...');
  const caseClose = () => toast('Case Closed...');
  const summary = () => toast('Summary Updated...');
  const statusUpdated = () => toast('Status Updated...');

  const [casesArray, setCasesArray] = useState<CasesType[]>([])
  const [selectedStatus, setSelectedStatus] = useState("");

  const router = useRouter()

  const FormSchema = z.object({
    dateName: z.string({
      required_error: "Date Name is required"
    }),
    dateValue: z.date({
      required_error: "Please select a Date.",
    }),
  })

  const SummaryFormSchema = z.object({
    summaryUpdate: z.string(),
  })

  const StatusFormSchema = z.object({
    status: z.string({
      required_error: "Status is required"
    }),
  })

  const statusForm = useForm<z.infer<typeof StatusFormSchema>>({
    resolver: zodResolver(StatusFormSchema),
    defaultValues: {
      status: "",
    },
  })

  // Function to handle status update form submission
  async function handleStatusUpdate(data: z.infer<typeof StatusFormSchema>) {
    try {
      setIsLoading(true);

      const documentId = params.viewCase;
      const collectionId = "Cases";

      // Get the existing case document from Firebase
      const caseDocRef = doc(db, collectionId, documentId);
      const caseDocSnapshot = await getDoc(caseDocRef);

      if (caseDocSnapshot.exists()) {
        // If the document exists, update the status
        const existingData = caseDocSnapshot.data();
        existingData.status = data.status;

        // Update the document in Firebase
        await updateDoc(caseDocRef, existingData).then(() => {
          statusUpdated();
          setSelectedStatus(data.status); // Update selected status
          fetchData(); // If you want to refresh the data after updating the status
        });
      } else {
        addError();
      }
    } catch (error) {
      addError();
    } finally {
      setIsLoading(false);
    }
  }

  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dateName: "",
    },
  })

  const id = params.viewCase

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsLoading(true)

      const { dateName, dateValue } = data

      const collectionId = "Cases";
      const documentId = params.viewCase;

      // Get the existing case document from Firebase
      const caseDocRef = doc(db, collectionId, documentId);
      const caseDocSnapshot = await getDoc(caseDocRef);

      if (caseDocSnapshot.exists()) {
        // If the document exists, update the dates
        const existingData = caseDocSnapshot.data();

        // Check if the dateName already exists in dates
        if (existingData.dates && existingData.dates[dateName]) {
          // If dateName exists, add the new date to the existing array
          existingData.dates[dateName].push(dateValue);
        } else {
          // If dateName doesn't exist, create a new array with the new date
          existingData.dates = {
            ...existingData.dates,
            [dateName]: [dateValue],
          };
        }

        // Update the document in Firebase
        await updateDoc(caseDocRef, existingData);

        // Reset the form to its initial state
        form.reset({
          dateName: "", // Reset other fields if needed
        });

        notify()
      } else {
        addError()
      }
    } catch (error) {
      addError()
    } finally {
      setIsLoading(false);
    }
  }

  const fetchData = useCallback(async () => {
    const collectionRef = collection(db, "Cases");

    const querySnapshot = await getDocs(collectionRef);

    const data: CasesType[] = []

    querySnapshot.forEach((doc) => {
      const dataFromDoc = doc.data() as CasesType;
      data.push({ ...dataFromDoc, documentId: doc.id });
    });

    // Filter the casesArray based on the documentId
    const filteredCases = data.filter((caseData) => caseData.documentId === id);
    setCasesArray(filteredCases);
  }, [id]);

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleStatusClick = async () => {
    try {
      setIsLoading(true);

      const documentId = params.viewCase;
      const collectionId = "Cases";

      // Get the existing case document from Firebase
      const caseDocRef = doc(db, collectionId, documentId);
      const caseDocSnapshot = await getDoc(caseDocRef);

      if (caseDocSnapshot.exists()) {
        // If the document exists, update the status to "Closed"
        const existingData = caseDocSnapshot.data();
        existingData.status = "Closed";

        // Update the document in Firebase
        await updateDoc(caseDocRef, existingData).then(() => {
          caseClose();
          fetchData();
        });
      } else {
        addError();
      }
    } catch (error) {
      addError();
    } finally {
      setIsLoading(false);
    }
  };



  const formsummary = useForm<z.infer<typeof SummaryFormSchema>>({
    resolver: zodResolver(SummaryFormSchema),
    defaultValues: {
      summaryUpdate: casesArray[0]?.summary,
    },
  })

  useEffect(() => {
    // Update formsummary default value when casesArray changes
    formsummary.setValue('summaryUpdate', casesArray[0]?.summary);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [casesArray]);

  async function handleSummaryUpdate(datasummary: z.infer<typeof SummaryFormSchema>) {
    try {
      setIsLoading(true);

      const documentId = params.viewCase;
      const collectionId = "Cases";

      // Get the existing case document from Firebase
      const caseDocRef = doc(db, collectionId, documentId);
      const caseDocSnapshot = await getDoc(caseDocRef);

      if (caseDocSnapshot.exists()) {
        // If the document exists, update the summary
        const existingData = caseDocSnapshot.data();
        existingData.summary = datasummary.summaryUpdate;

        // Update the document in Firebase
        await updateDoc(caseDocRef, existingData).then(() => {
          summary();
          fetchData(); // If you want to refresh the data after updating the summary
        });
      } else {
        addError();
      }
    } catch (error) {
      addError();
    } finally {
      setIsLoading(false);
    }
  }

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

  return (
    <div className='pt-32 pb-24 px-10'>
      <div className='flex flex-col justify-center items-center align-middle w-full'>
        <div className='text-center pb-10 w-full'>
          {casesArray.map((caseData) => (
            <Card key={caseData.documentId} className="w-full mb-4">
              <CardHeader>
                <CardTitle>View Case</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='pb-5'>
                  <strong>Case Number:</strong> {caseData.caseNo}
                </div>
                <div className='pb-10'>
                  <strong>Case Name:</strong> {caseData.caseName}
                </div>

                <div className='flex flex-row flex-wrap justify-around align-middle items-center pb-10'>
                  <div>
                    <strong>Department:</strong> {caseData.department}
                  </div>
                  <div>
                    <strong>Location:</strong> {caseData.location}
                  </div>
                  <div>
                    <strong>Court:</strong> {caseData.court}
                  </div>
                </div>

                <div className='pb-10'>
                  <div className={caseData.status === 'Active' ? 'text-primary' : 'text-destructive'}>
                    <Popover>
                      <PopoverTrigger>
                        <strong>Status: {selectedStatus || caseData.status}</strong>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Form {...form}>
                          <form
                            onSubmit={statusForm.handleSubmit(handleStatusUpdate)}
                            className="w-2/3 space-y-6"
                          >
                            <FormField
                              control={statusForm.control}
                              name="status"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Reason for Closure</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select reason for case Closure" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Judgment">Jugdement</SelectItem>
                                      <SelectItem value="Client Withdrawal">Client Withdrawal</SelectItem>
                                      <SelectItem value="Non Payment">Non Payment</SelectItem>
                                      <SelectItem value="Death">Death</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit">Submit</Button>
                          </form>
                        </Form>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className='pb-5'>
                  <strong>Summary:</strong>
                  <div className='pb-5'>
                    {caseData.summary}
                  </div>

                  {/* PopOver */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button>Update</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full">
                      <Form {...form}>
                        <form
                          onSubmit={formsummary.handleSubmit(handleSummaryUpdate)}
                          className="w-full space-y-6">

                          {/* Summary */}
                          <FormField
                            control={formsummary.control}
                            name="summaryUpdate"
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>Add Updates</FormLabel>
                                <FormControl>
                                  <Textarea {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          {isLoading ? (
                            <Button disabled>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Please wait
                            </Button>
                          ) : (
                            <Button type="submit">Update</Button>
                          )}
                        </form>
                      </Form>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Date */}
        <div className='flex flex-col justify-center align-middle items-center text-base'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-fit space-y-6">

              {/* Date Name */}
              <FormField
                control={form.control}
                name="dateName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Date Name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Date Value */}
              <FormField
                control={form.control}
                name="dateValue"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Value</FormLabel>
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

              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit">Add Date</Button>
              )}
            </form>
          </Form>

          <Toaster />
        </div>
      </div>

      <div className='w-full items-start pt-5'>
        <Link
          href='/cases/view'
          className={`${buttonVariants({ variant: "default" })} px-5 text-xl font-bold`}
        >
          <ArrowLeftCircle />
        </Link>
      </div>
    </div>
  )
}

export default ViewCase
