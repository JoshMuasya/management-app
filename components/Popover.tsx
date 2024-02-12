import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { PopoverType } from '@/interface'
import { Button } from './ui/button'


const UserButton = ({ userName, handleSignOut, department, rank }: PopoverType) => {
    return (
        <div>
            <Popover>
                <PopoverTrigger>{userName}</PopoverTrigger>
                <PopoverContent>
                    <div className='flex flex-col justify-center items-center align-middle'>
                        <div className='flex flex-col justify-center items-center align-middle pb-5'>
                            <div>
                                {department}
                            </div>
                            <div>
                                {rank}
                            </div>
                        </div>

                        <div>
                            <Button
                            onClick={handleSignOut}
                            >
                                Log Out
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default UserButton
