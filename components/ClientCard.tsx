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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { addDoc, collection } from "firebase/firestore"
import { useState } from "react"
import { db, storage } from "@/lib/firebase"

import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';
import { useAppStore } from "@/store/store"
import DropzoneComponent from 'react-dropzone'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { ArrowLeftCircle, Loader2 } from "lucide-react"
import Link from "next/link"

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
    required_error: "Select the service being offered"
  }),
  indemnityClause: z.instanceof(File),
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
  const [indemnityFile, setIndemnityFile] = useState<File | null>(null)

  const notify = () => toast('Client Added...');
  const errorAdding = () => toast('Please Try Again...');

  const router = useRouter();

  const [clientID, setClientID] = useAppStore((state) => [
    state.clientID,
    state.setClientID
  ])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      clientName: "",
      clientId: "",
      phoneNumber: "",
      pin: "",
      address: "",
      servicesProvided: "",
      indemnityClause: new File([], ""),
      nextOfKinName: "",
      nextOfKinNumber: "",
      nextOfKinAddress: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const storageRef = ref(storage, `indemnity/${data.clientId}-${indemnityFile?.name}`);

      await uploadBytes(storageRef, indemnityFile!);

      const downloadURL = await getDownloadURL(storageRef);

      const clientData = { ...data, indemnityClause: downloadURL };

      const docRef = await addDoc(collection(db, "Clients"), clientData);

      console.log(docRef)

      setIsLoading(true);

      const newClientId = data.clientId;

      setClientID(newClientId)

      notify();

      router.push('/cases')
    } catch (error) {
      errorAdding();
    }
  }

  return (
    <div>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the service offered" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="banking">Banking and Finance</SelectItem>
                        <SelectItem value="coporate">Coporate M&A</SelectItem>
                        <SelectItem value="disputeResolution">Dispute Resolution</SelectItem>
                        <SelectItem value="trade">International Trade</SelectItem>
                        <SelectItem value="intellectualProperty">Intellectual Property</SelectItem>
                        <SelectItem value="privateClient">Private Client</SelectItem>
                        <SelectItem value="project">Project & Infrastructure</SelectItem>
                        <SelectItem value="realEstate">Real Estate</SelectItem>
                        <SelectItem value="tax">Tax</SelectItem>
                        <SelectItem value="Employement">Employment</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Input
                        type="file"
                        accept=".pdf"
                        multiple={false}
                        className="dark:bg-transparent cursor-pointer file:cursor-pointer file:text-primary dark:border-primary dark:ring-offset-primary"
                        onChange={(e) => {
                          field.onChange(e.target.files ? e.target.files[0] : null);
                          setIndemnityFile(e.target.files ? e.target.files[0] : null);
                        }}
                      />
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

              {/* Login Button */}
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
                  Add Client
                </Button>
              )}
            </form>
          </Form>

          <Toaster />
        </CardContent>
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
