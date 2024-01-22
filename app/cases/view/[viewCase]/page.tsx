'use client'

import React from 'react'

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
import { Button } from "@/components/ui/button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Loader2 } from "lucide-react"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { addDoc, collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

import toast, { Toaster } from 'react-hot-toast';

const ViewCase = ({
  params
}: {
  params: { viewCase: string }
}) => {

  const notify = () => toast('Date Added...');
  const addError = () => toast('Please try Again...');

  const FormSchema = z.object({
    dateName: z.string({
      required_error: "Date Name is required"
    }),
    dateValue: z.date({
      required_error: "A date of birth is required.",
    }),
  })

  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dateName: "",
    },
  })

  const collectionId = "Cases"
  const documentId = params.viewCase

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

  return (
    <div className='pt-32 pb-24 px-10'>
      <div className='font-bold text-2xl text-center pb-10'>
        View Case
      </div>

      {/* Add Date */}
      <div className='flex flex-col justify-center align-middle items-center'>
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
  )
}

export default ViewCase
