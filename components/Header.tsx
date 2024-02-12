'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import { ThemeToggler } from '@/components/ThemeToggler'

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import UserButton from './Popover';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { UserData } from '@/interface';
import { useRouter } from 'next/navigation';

const Header = () => {
    const [isLogin, setIsLogin] = useState(false)
    const [userData, setUserData] = useState<UserData>({});
    const router = useRouter()

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
    }, [])

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

    return (
        <div className='p-5 fixed top-0 left-0 z-20 flex flex-row justify-between w-full bg-black s:bg-transparent opacity-70'>
            {/* Logo */}
            <div>
                <Image
                    src='/logo.png'
                    alt='Logo'
                    width={65}
                    height={56}
                />
            </div>

            {/* Theme and Profile */}
            {isLogin &&
                <div className="flex flex-row justify-around items-end align-middle max-w-xs w-1/2">
                    {/* Theme */}
                    <ThemeToggler />

                    <UserButton
                        userName={userData.fullname ?? ''}
                        handleSignOut={() => signOut(auth)
                            .then(() => {
                                router.push('/auth/login')
                            })
                        }
                        department={userData.department ?? ''}
                        rank={userData.rank ?? ''}
                    />
                </div>
            }

            {/* Theme and Profile */}
            {!isLogin &&
                <div className="flex flex-row justify-around items-end align-middle max-w-xs w-1/2">
                    {/* Theme */}
                    <ThemeToggler />
                </div>
            }
        </div>
    )
}

export default Header
