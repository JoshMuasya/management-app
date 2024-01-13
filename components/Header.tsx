import React from 'react'
import Image from 'next/image';

import { ThemeToggler } from '@/components/ThemeToggler'

import { UserButton } from "@clerk/nextjs";

const Header = () => {
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
            <div className="flex flex-row justify-around items-end align-middle max-w-xs w-1/2">
                {/* Theme */}
                <ThemeToggler />

                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    )
}

export default Header
