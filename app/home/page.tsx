'use client'

import { CardHome } from "@/components/Card"
import { UserData } from "@/interface"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Home = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserData>({})

    const fetchUserData = async (uid: string) => {
        const usersCollection = collection(db, "Users");

        const q = query(usersCollection, where('uid', '==', uid));

        try {
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();

                setUserData(userData.data);
            } else {
                console.log("User not found")
            }
        } catch (error) {
            console.error("Trouble fetching User Data:", error)
        }
    }

    console.log(userData)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log(user)
            setLoading(false);
            if (!user) {
                router.replace('/auth/login');
            } else {
                const uid = user.uid
                fetchUserData(uid)
            }
        });

        return () => {
            unsubscribe();
        };
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='w-full h-screen m:h-screen flex flex-col justify-center align-middle items-center back-pic-dark bg-fixed bg-cover pt-16 pb-14'>
            {/* Main */}
            <div className='z-10 flex flex-col items-center align-middle justify-center w-4/5 my-24 m:my-5'>
                {/* Top */}
                <div className='flex flex-col lg:flex-row items-center align-middle justify-center w-full lg:mb-10 '>
                    {/* Left */}
                    {userData.rank?.toLowerCase() === 'partner' && (
                        <div className="pb-10 pr-0 lg:pr-10 lg:pb-0">
                            <CardHome
                                title="USERS"
                                desc="Add or view Users"
                                button1="Add User"
                                button2="View Users"
                                link1="/lawyers"
                                link2="/lawyers/view"
                            />
                        </div>
                    )}

                    {/* Right */}
                    <div className="pb-10 lg:pb-0">
                        <CardHome
                            title="CASES"
                            desc="Add or View Cases"
                            button1="Add Case"
                            button2="View Cases"
                            link1="/cases"
                            link2="/cases/view"
                        />
                    </div>
                </div>

                {/* Bottom */}
                <div className='flex flex-col lg:flex-row items-center align-middle justify-center w-full m:mb-10'>
                    {/* Left */}
                    <div className="pb-10 pr-0 lg:pr-10 lg:pb-0">
                        <CardHome
                            title="Clients"
                            desc="Add or View Clients"
                            button1="Add Client"
                            button2="View Clients"
                            link1="/clients"
                            link2="/clients/view"
                        />
                    </div>

                    {/* Right */}
                    {userData.rank?.toLowerCase() === 'partner' && (
                        < div className="pb-10 lg:pb-0">
                            <CardHome
                                title="FINANCES"
                                desc="Check out the Firms Finances"
                                button1="Finances"
                                button2="Filter"
                                link1="/finances"
                                link2="/finances/filter"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

export default Home