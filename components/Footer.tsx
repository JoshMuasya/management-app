import { CopyrightIcon } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <div className='fixed bg-primary bottom-0 left-0 w-full z-10'>
        {/* copyright */}
        <div className='w-full flex flex-row px-5 py-2 justify-end font-shadow-light text-sx m:text-l'>
            {/* copy */}
            <div>
              Copyright
            </div>

            {/* Icon */}
            <div>
              <CopyrightIcon />
            </div>

            {/* Company */}
            <div>
              Digimatic 2024
            </div>
        </div>
    </div>
  )
}

export default Footer
