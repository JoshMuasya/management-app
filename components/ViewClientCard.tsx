'use client'

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useState, useEffect } from "react"
import { CasesType } from "@/interface"
import { useRouter } from "next/navigation"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/firebase"

export function ViewClientCard() {
  const [casesArray, setCasesArray] = useState<CasesType[]>([])
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const collectionRef = collection(db, "Cases");

      const querySnapshot = await getDocs(collectionRef)

      const data: CasesType[] = []

      querySnapshot.forEach((doc) => {
        const dataFromDoc = doc.data() as CasesType;
        data.push({ ...dataFromDoc, documentId: doc.id });
      });

      setCasesArray(data);
    }

    fetchData();
  }, [])

  console.log(casesArray)

  return (
    <Card className="w-full bg-accent">
      <CardHeader>
        <CardTitle>Client Name</CardTitle>
        <CardDescription>Cases related to Client Name</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem
            value='item-1'>
            <AccordionTrigger>
              <div className='flex flex-col justify-center items-center align-middle w-full'>
                {/* Top */}
                <div className='flex flex-row justify-around items-center align-middle w-full pb-2'>
                  {/* Case Number */}
                  <div>
                    Case Number
                  </div>

                  {/* Case Name */}
                  <div>
                    Case Name
                  </div>

                  {/* Department */}
                  <div>
                    Department
                  </div>
                </div>

                <hr
                  className='w-full pb-4 px-5'
                />

                {/* Bottom */}
                <div className='flex flex-row flex-wrap justify-around items-center align-middle w-full'>
                  {/* Location */}
                  <div>
                    Location
                  </div>

                  {/* Court */}
                  <div>
                    Court
                  </div>

                  {/* Status */}
                  <div>
                    Status
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className='flex flex-col justify-center items-center align-middle'>
                {/* Top */}
                <div>
                  Summary
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button>View More</Button>
      </CardFooter>
    </Card>
  )
}
