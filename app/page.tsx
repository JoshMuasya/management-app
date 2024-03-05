import { buttonVariants } from "@/components/ui/button"
import Link from "next/link";

export default function Home() {
  return (
    <main className='w-full h-screen flex flex-col justify-center align-middle items-center back-pic-dark bg-fixed bg-cover'>
      {/* overlay */}
      <div className='absolute top-0 left-0 right-0 bottom-0 z-[2] h-screen bg-black opacity-70' />

      {/* Main */}
      <div className='z-10 flex flex-col justify-center align-middle items-center'>
        {/* Description */}
        <div className='flex flex-col justify-center align-middle items-center'>
          <h1 className='pb-12 text-primary font-black text-3xl lg:text-4xl'>
            DIGIMATIC
          </h1>

          <h1 className='pb-12 text-ring font-black text-xl lg:text-3xl'>
            LAW FIRM MANAGEMENT
          </h1>

          <h1 className='pb-12 text-primary font-black text-3xl lg:text-4xl'>
            APP
          </h1>

          {/* Button */}
          <Link
              href='/auth/login'
              className={`${buttonVariants({ variant: "default" })} px-5 text-xl font-bold`}
            >
              LOGIN
            </Link>
        </div>
      </div>

    </main>
  )
}
