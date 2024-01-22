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
import { toast } from "@/components/ui/use-toast"
import { addDoc, collection } from "firebase/firestore"
import { useState } from "react"
import { db } from "@/firebase"

const FormSchema = z.object({
  clientName: z.string({
    required_error: "This field can't be empty!!"
  }),
  clientId: z.string({
    required_error: "This field can't be empty!!"
  }),
  phoneNumber: z.string({
    required_error: "This field can't be empty!!"
  }),
  pin: z.string({
    required_error: "This field can't be empty!!"
  }),
  address: z.string({
    required_error: "This field can't be empty!!"
  }),
  servicesProvided: z.string({
    required_error: "This field can't be empty!!"
  }),
  indemnityClause: z.string({
    required_error: "This field can't be empty!!"
  }),
  nextOfKinName: z.string({
    required_error: "This field can't be empty!!"
  }),
  nextOfKinNumber: z.string({
    required_error: "This field can't be empty!!"
  }),
  nextOfKinAddress: z.string({
    required_error: "This field can't be empty!!"
  }),
})

export function ClientCard() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      clientName: "",
      clientId: "",
      phoneNumber: "",
      pin: "",
      address: "",
      servicesProvided: "",
      indemnityClause: "",
      nextOfKinName: "",
      nextOfKinNumber: "",
      nextOfKinAddress: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const caseData = await addDoc(collection(db, "Clients"), data);

      setIsLoading(true);

      console.log("Added Client")
    } catch (error) {
      console.error('Error Adding Case:', error)
    }
  }

  return (
    <Card className="lg:w-[500px] w-[350px]">
      <CardHeader>
        <CardTitle>Add Client</CardTitle>
        <CardDescription>Please fill in all the inputs in the form below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

            {/* Client Name */}
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Client Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Client ID */}
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Client ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pin */}
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pin</FormLabel>
                  <FormControl>
                    <Input placeholder="Pin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Services Provided */}
            <FormField
              control={form.control}
              name="servicesProvided"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services Provided</FormLabel>
                  <FormControl>
                    <Input placeholder="Services Provided" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Indemnity Clause */}
            <FormField
              control={form.control}
              name="indemnityClause"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indemnity Clause</FormLabel>
                  <FormControl>
                    <Input placeholder="Indemnity Clause" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Next of Kin Name */}
            <FormField
              control={form.control}
              name="nextOfKinName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next of Kin Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Next of Kin Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Next of Kin Number */}
            <FormField
              control={form.control}
              name="nextOfKinNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next of Kin Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Next of Kin Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Next of Kin Address */}
            <FormField
              control={form.control}
              name="nextOfKinAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next of Kin Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Next of Kin Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
