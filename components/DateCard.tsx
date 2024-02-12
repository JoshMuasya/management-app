'use client'

import * as React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"

import { Loader2 } from "lucide-react"
import { DatesType } from "@/interface"

const FormSchema = z.object({
  dateName: z.string({
    required_error: "Date Name is required"
  }),
  dateValue: z.string({
    required_error: "Date Value is Required"
  })
})

export function DateCard({ dateName, dateValue }: DatesType) {
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dateName: "",
      dateValue: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await addDoc(collection(db, "Date History"), data)
        .then((dateData) => {
          setIsLoading(true);
          console.log("Dates Added:", dateData.id);
        })
        .catch((e) => {
          console.log("Error adding Dates:", e);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Dates Related to this Case</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {/* Preview Date */}
          <div className="flex flex-row justify-around items-center align-middle border-b border-solid mb-10">
            {/* Date Name */}
            <div>
              Date Name
            </div>

            {/* Mid Border */}
            <div
              className="h-10 border-l border-solid"
            />

            {/* Date Value */}
            <div>
              Date Value
            </div>
          </div>

          {/* Dates */}
          <div className="flex flex-row justify-around items-center align-middle border-b border-solid mb-10">
            {/* Date Name */}
            <div>
              {dateName}
            </div>

            {/* Mid Border */}
            <div
              className="h-10 border-l border-solid"
            />

            {/* Date Value */}
            <div>
              {dateValue}
            </div>
          </div>
        </div>

        {/* Add Date */}
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

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
                  <FormItem>
                    <FormLabel>Date Value</FormLabel>
                    <FormControl>
                      <Input placeholder="Date Value" {...field} />
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
                <Button type="submit">Submit</Button>
              )}
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}
