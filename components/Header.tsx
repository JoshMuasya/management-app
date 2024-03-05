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
import toast, { Toaster } from 'react-hot-toast';

const loginError = () => toast('Please try Again...');
const login = () => toast('Login Successful...');

const Header = () => {
    const [isLogin, setIsLogin] = useState(false)
    const [userData, setUserData] = useState<UserData>({});
    const [userDataFetched, setUserDataFetched] = useState(false);
    const router = useRouter()

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (isLogin) {
                signOut(auth)
                    .then(() => {
                        // Optional: You may want to navigate the user to a logout page
                    })
                    .catch(error => {
                        console.error('Error signing out:', error);
                    });
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isLogin, router]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setIsLogin(true);
                if (!userDataFetched) {
                    fetchUserData(uid);
                }
            } else {
                setIsLogin(false);
                // Reset user data if user is not logged in
                setUserData({});
                setUserDataFetched(false);
            }
        });
    
        return () => unsubscribe();
    }, [userDataFetched]);

    const fetchUserData = async (uid: string) => {
        const usersCollection = collection(db, "Users");

        const q = query(usersCollection, where('uid', '==', uid))

        try {
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data() as UserData;
                setUserData(userData);
                setUserDataFetched(true);

                login();
            } else {
                loginError();
            }
        } catch (error) {
            loginError();
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

            <Toaster />
        </div>
    )
}

export default Header
