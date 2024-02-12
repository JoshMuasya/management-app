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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addDoc, collection } from "firebase/firestore"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast';
import { useAppStore } from "@/store/store"
import { useUser } from "@clerk/nextjs"

const FormSchema = z.object({
  caseNo: z.string({
    required_error: "This field can't be empty!!"
  }),
  caseName: z.string({
    required_error: "This field can't be empty!!"
  }),
  clientId: z.string({
    required_error: "This field can't be empty!!"
  }),
  department: z.string({
    required_error: "Please select a department"
  }),
  location: z.string({
    required_error: "This field can't be empty!!"
  }),
  court: z.string({
    required_error: "This field can't be empty!!"
  }),
  status: z.string({
    required_error: "This field can't be empty!!"
  }),
  summary: z.string({
    required_error: "This field can't be empty!!"
  }),
  loggedBy: z.string({
    required_error: "This field can't be empty!!"
  }),
  instructionDate: z.string({
    required_error: "This field can't be empty!!"
  }),
})

const addError = () => toast('Please try Again...');

export function CasesCard() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  const user = useUser();

  const userName = user.user?.fullName ?? ''

  const [clientID] = useAppStore((state) => [
    state.clientID
  ])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      caseNo: "",
      caseName: "",
      clientId: clientID,
      department: "Select a Department",
      location: "",
      court: "",
      status: "",
      summary: "",
      loggedBy: userName,
      instructionDate: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const caseData = await addDoc(collection(db, "Cases"), data);

      setIsLoading(true);

      const caseId = caseData.id

      router.push(`/cases/view/${caseId}`)
    } catch (error) {
      addError()
    }
  }

  return (
    <Card className="lg:w-[500px] w-[350px]">
      <CardHeader>
        <CardTitle>Add Case</CardTitle>
        <CardDescription>Please fill in all the inputs in the form below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

            {/* Case Number */}
            <FormField
              control={form.control}
              name="caseNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Case Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Case Name */}
            <FormField
              control={form.control}
              name="caseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Case Name" {...field} />
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
                    <Input {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="civil">Civil</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="probate">Probate & Family</SelectItem>
                      <SelectItem value="adr">Alternative Dispute Resolution</SelectItem>
                      <SelectItem value="criminal">Criminal</SelectItem>
                      <SelectItem value="employment">Employment & Labor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Court */}
            <FormField
              control={form.control}
              name="court"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Court</FormLabel>
                  <FormControl>
                    <Input placeholder="Court" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input placeholder="Status" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Summary */}
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Summary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Logged By */}
            <FormField
              control={form.control}
              name="loggedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logged By</FormLabel>
                  <FormControl>
                    <Input {...field} disabled value={userName} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Instructions Date */}
            <FormField
              control={form.control}
              name="instructionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions Date</FormLabel>
                  <FormControl>
                    <Input placeholder="Instructions Date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Button */}
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
      </CardContent>
    </Card>
  )
}
