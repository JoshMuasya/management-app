import AddFinancesForm from '@/components/AddFinancesForm'
import React from 'react'

const AddFinances = () => {
    return (
        <div className="w-full h-fit flex flex-col justify-center align-middle items-center">
            <div className="z-10 w-full flex flex-col justify-center align-middle items-center mt-24 mb-14">
                <AddFinancesForm />
            </div>
        </div>
    )
}

export default AddFinances
