'use client'

import React from 'react'

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
import { CasesType, ClientFormData } from "@/interface"
import { useRouter } from "next/navigation"
import { collection, documentId, getDocs } from "firebase/firestore"
import { db } from "@/firebase"

const ViewClient = ({
    params
}: {
    params: { viewClient: string }
}) => {
    const id = '33365401'

    const [casesArray, setCasesArray] = useState<CasesType[]>([])
    const [clientsArray, setClientsArray] = useState<ClientFormData[]>([])
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const collectionRef = collection(db, "Cases");

            const querySnapshot = await getDocs(collectionRef)

            const data: CasesType[] = []

            querySnapshot.forEach((doc) => {
                const dataFromDoc = doc.data() as CasesType;
                if (dataFromDoc.clientId === id) {
                    data.push({ ...dataFromDoc, documentId: doc.id });
                }
            });

            setCasesArray(data);
        }

        const fetchClient = async () => {
            const collectionRef = collection(db, "Clients");

            const querySnapshot = await getDocs(collectionRef)

            const data: ClientFormData[] = [];

            querySnapshot.forEach((doc) => {
                const dataFromDoc = doc.data() as ClientFormData;
                if (dataFromDoc.clientId === id) {
                    data.push({ ...dataFromDoc });
                }
            });

            setClientsArray(data)
        }

        fetchData();
        fetchClient();
    }, [id])

    const handleButtonClick = (documentId: string) => {
        router.push(`/cases/view/${documentId}`)
    };

    return (
        <div className='pt-28 pb-10 px-5'>
            <div className='flex flex-row justify-start'>
                <div className='pr-10 flex-shrink-0 h-screen'>
                    <div className='flex flex-col justify-center align-middle items-center pt-16'>
                        {clientsArray.map((client, index) => (
                            <div key={index}>
                                {/* Name */}
                                <div>
                                    <strong>Name:</strong> {client.clientName}
                                </div>

                                {/* ID */}
                                <div>
                                    <strong>ID:</strong> {client.clientId}
                                </div>

                                {/* Pin */}
                                <div>
                                    <strong>Pin:</strong> {client.pin}
                                </div>

                                {/* Email */}
                                <div>
                                    <strong>Email:</strong> {client.email}
                                </div>

                                {/* Number */}
                                <div>
                                    <strong>Phone Number:</strong> {client.phoneNumber}
                                </div>

                                {/* Address */}
                                <div>
                                    <strong>Address:</strong> {client.address}
                                </div>

                                {/* Services Provided */}
                                <div>
                                    <strong>Services Provided:</strong> {client.servicesProvided}
                                </div>

                                {/* Indemnity Clause */}
                                <div>
                                    <strong>Indemnity Clause:</strong> {client.indemnityClause}
                                </div>

                                {/* Next of Kin Name */}
                                <div>
                                    <strong>Next of Kin Name:</strong> {client.nextOfKinName}
                                </div>

                                {/* Next of Kin number */}
                                <div>
                                    <strong>Next of Kin Number:</strong> {client.nextOfKinNumber}
                                </div>

                                {/* Next of Kin Address */}
                                <div>
                                    <strong>Next of Kin Address:</strong> {client.nextOfKinAddress}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex-grow'>
                    <Card className="w-full bg-accent">
                        <CardHeader>
                            <CardTitle>Client Name</CardTitle>
                            <CardDescription>Cases related to Client Name</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {casesArray.length > 0 ? (
                                <Accordion type="single" collapsible>
                                    {casesArray.map((item, index) => (
                                        <AccordionItem
                                            key={index}
                                            value={`item-${index}`}>
                                            <AccordionTrigger>
                                                <div className='flex flex-col justify-center items-center align-middle w-full'>
                                                    {/* Top */}
                                                    <div className='flex flex-row justify-around items-center align-middle w-full pb-2'>
                                                        {/* Case Number */}
                                                        <div>
                                                            {item.caseNo}
                                                        </div>

                                                        {/* Case Name */}
                                                        <div>
                                                            {item.caseName}
                                                        </div>

                                                        {/* Department */}
                                                        <div>
                                                            {item.department}
                                                        </div>
                                                    </div>

                                                    <hr
                                                        className='w-full pb-4 px-5'
                                                    />

                                                    {/* Bottom */}
                                                    <div className='flex flex-row flex-wrap justify-around items-center align-middle w-full'>
                                                        {/* Location */}
                                                        <div>
                                                            {item.location}
                                                        </div>

                                                        {/* Court */}
                                                        <div>
                                                            {item.court}
                                                        </div>

                                                        {/* Status */}
                                                        <div>
                                                            {item.status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className='flex flex-col justify-center items-center align-middle'>
                                                    {/* Top */}
                                                    <div className='pb-5'>
                                                        {item.summary}
                                                    </div>

                                                    {/* Bottom */}
                                                    <div>
                                                        <Button
                                                        onClick={() => handleButtonClick(item.documentId)}
                                                        >View More</Button>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <div className="text-center text-gray-500">
                                    No cases to display
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ViewClient
