'use client'

import React, { useEffect, useState } from 'react'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { collection, getDocs, query, where } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { CasesType, UserData } from '@/interface'

import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'

const CasesAccordion = () => {
    const [casesArray, setCasesArray] = useState<CasesType[]>([])
    const router = useRouter();
    const [userData, setUserData] = useState<UserData>({})
    const [isLogin, setIsLogin] = useState(false)

    const fetchUserData = async (uid: string) => {
        const usersCollection = collection(db, "Users");

        const q = query(usersCollection, where('uid', '==', uid))

        try {
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                setUserData(userData.data);
            } else {
                console.log("User not found in the database")
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setIsLogin(true)
                fetchUserData(uid)
            } else {
                setIsLogin(false)
            }
        })
    }, [isLogin])

    useEffect(() => {
        const fetchData = async () => {
            const collectionRef = collection(db, "Cases");
            let queryRef;

            if (userData.rank?.toLowerCase() === "partner") {
                queryRef = query(collectionRef);
            } else if (userData.department) {
                queryRef = query(collectionRef, where('department', '==', userData.department));
            }

            try {
                if (queryRef) {
                    const querySnapshot = await getDocs(queryRef);
                    const data: CasesType[] = [];

                    querySnapshot.forEach((doc) => {
                        const dataFromDoc = doc.data() as CasesType;
                        data.push({ ...dataFromDoc, documentId: doc.id });
                    });

                    setCasesArray(data);
                }
            } catch (error) {
                console.error('Error fetching cases data:', error);
            }
        };

        if (isLogin && userData.department) {
            fetchData();
        }
    }, [isLogin, userData])

    const handleClick = (caseId: string) => {
        router.push(`/cases/view/${caseId}`)
    }

    return (
        <div>
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
                                <div>
                                    {item.summary}
                                </div>

                                {/* Dates */}
                                <div className='pt-5'>
                                    {/* Dates */}
                                    <Card className="w-[400px] lg:w-[600px]">
                                        <CardHeader>
                                            <CardTitle>Dates Related to this Case</CardTitle>
                                        </CardHeader>
                                        <CardContent className='flex flex-col items-center align-middle'>
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
                                                {item.dates && Object.entries(item.dates).map(([dateName, dateValues], dateIndex) => (
                                                    <div
                                                        key={dateIndex}
                                                        className="flex flex-row justify-around items-center align-middle border-b border-solid mb-10"
                                                    >
                                                        <div className=''>{dateName}</div>
                                                        <div className="h-10 border-l border-solid mx-5" />

                                                        <div>
                                                            <ul>
                                                                {(dateValues as unknown as { seconds: number }[])
                                                                    .sort((a, b) => a.seconds - b.seconds) // Sort dates in descending order
                                                                    .map((dateValue, valueIndex) => (
                                                                        <li key={valueIndex}>{new Date(dateValue.seconds * 1000).toLocaleDateString()}</li>
                                                                    ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* View More Button */}
                                            <Button
                                                className='items-center font-bold hover:italic'
                                                onClick={() => handleClick(item.documentId)}
                                            >
                                                View More
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default CasesAccordion
