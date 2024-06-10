"use client"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"

import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { UserDataFirestore } from "@/interface"
import { useRouter } from "next/navigation"
import { ArrowLeftCircle, ArrowUp, ArrowUpCircle } from "lucide-react"

export function ViewUsers() {
    const [usersArray, setUsersArray] = useState<UserDataFirestore[]>([])
    const router = useRouter()
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersCollection = collection(db, 'Users');
                const usersSnapshot = await getDocs(usersCollection);

                const data: UserDataFirestore[] = []

                usersSnapshot.forEach((doc) => {
                    const dataFromDoc = doc.data() as UserDataFirestore;
                    data.push({ ...dataFromDoc });

                    setUsersArray(data);
                });

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }

        fetchData();
    }, [])

    const handleClick = (userId: string) => {
        router.push(`/lawyers/view/update-user/${userId}`)
    }

    const handleScroll = () => {
        setShowScrollButton(window.scrollY > 100); // Show button after 100px scroll
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="flex flex-wrap justify-center">
            {usersArray.map((user, index) => (
                <Card
                    key={index}
                    className="lg:w-[500px] w-[350px] m-3"
                >
                    <CardHeader>
                        <CardTitle>{user.fullname}</CardTitle>
                        <CardDescription>{user.rank}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            User ID: {user.userid}
                        </div>

                        <div>
                            Phone Number: {user.phonenumber}
                        </div>

                        <div>
                            Email: {user.email}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button
                            onClick={() => handleClick(user.uid)}
                            variant='outline'
                        >
                            Update User
                        </Button>
                    </CardFooter>
                </Card>
            ))}

            {/* Back Button */}
            <div className='w-full items-start pt-5'>
                <Link
                    href='/home'
                    className={`${buttonVariants({ variant: "default" })} px-5 text-xl font-bold fixed bottom-14`}
                >
                    <ArrowLeftCircle />
                </Link>
            </div>

            {/* Scroll to Top Button */}
            {showScrollButton && (
                <Button
                    className="fixed bottom-14 right-10 bg-primary font-bold py-2 px-5 rounded shadow-lg"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <ArrowUpCircle />
                </Button>
            )}
        </div >
    )
}
