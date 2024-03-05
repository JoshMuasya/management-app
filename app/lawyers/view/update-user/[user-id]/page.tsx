'use client'

import React, { useEffect, useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UserDataFirestore } from '@/interface'
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const FormSchema = z.object({
  fullname: z.string(),
  rank: z.string(),
  userid: z.string(),
  phonenumber: z.string(),
  email: z.string(),
  department: z.string()
})

const UpdateUser = ({
  params
}: {
  params: { 'user-id': string }
}) => {
  const userId = params['user-id']
  const [userData, setUserData] = useState<UserDataFirestore[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullname: userData.length > 0 ? userData[0].fullname : '',
      rank: userData.length > 0 ? userData[0].rank : '',
      userid: userData.length > 0 ? userData[0].userid : '',
      phonenumber: userData.length > 0 ? userData[0].phonenumber : '',
      email: userData.length > 0 ? userData[0].email : '',
      department: userData.length > 0 ? userData[0].department : ''
    },
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const collectionRef = collection(db, "Users");

        const querySnapshot = await getDocs(collectionRef);

        const data: UserDataFirestore[] = []

        querySnapshot.forEach((doc) => {
          const dataFromDoc = doc.data() as UserDataFirestore;
          data.push(dataFromDoc);
        })

        const user = data.find((user) => user.uid === userId);
        if (user) {
          setUserData([user]); // Set the user data to state
        }

      } catch (error) {
        console.error("Failed to fetch Users:", error)
      }
    }

    fetchUserData();
  }, [userId])

  if (userData.length === 0) {
    return <div>Loading...</div>;
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const userId = params['user-id'];
      await updateUserInFirebase(userId, data);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }
  
  async function updateUserInFirebase(userId: string, updatedData: z.infer<typeof FormSchema>) {
    try {
      const usersRef = collection(db, "Users");
      const userQuery = query(usersRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(userQuery);
  
      if (querySnapshot.empty) {
        console.error("User with uid", userId, "not found");
        // Handle the case where user with the uid doesn't exist
        return; // Exit the function if no user found
      }
  
      const userDoc = querySnapshot.docs[0]; // Get the first document (assuming one user per uid)

      const fieldsToUpdate = Object.entries(updatedData).filter(
        ([key, value]) => value !== "" && value !== userDoc.data()[key] // Check for non-empty and changed values
      );

      const updateObject = Object.fromEntries(fieldsToUpdate);

      await updateDoc(userDoc.ref, updateObject);
      console.log("User data updated successfully!");
    } catch (error) {
      console.error("Error updating user document:", error);
    }
  }

  console.log(userData)

  return (
    <div className='pt-32 pb-24 px-10 flex flex-col justify-center items-center align-middle w-full'>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>Deploy your new project in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full Name" {...field}
                        value={field.value || userData[0].fullname}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
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
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Rank" {...field}
                        value={field.value || userData[0].rank}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* User ID */}
              <FormField
                control={form.control}
                name="userid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="User ID" {...field}
                        value={field.value || userData[0].userid}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phonenumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone Number" {...field}
                        value={field.value || userData[0].phonenumber}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
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
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email" {...field}
                        value={field.value || userData[0].email}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
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
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Department" {...field}
                        value={field.value || userData[0].department}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Update</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default UpdateUser
