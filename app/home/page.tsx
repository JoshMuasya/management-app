import { CardHome } from "@/components/Card"

const Home = () => {
    return (
        <div className='w-full h-full m:h-screen flex flex-col justify-center align-middle items-center back-pic-dark bg-fixed bg-cover pt-16 pb-14'>
            {/* Main */}
            <div className='z-10 flex flex-col items-center align-middle justify-center w-4/5 my-24 m:my-5'>
                {/* Top */}
                <div className='flex flex-col lg:flex-row items-center align-middle justify-center w-full lg:mb-10 '>
                    {/* Left */}
                    <div className="pb-10 pr-0 lg:pr-10 lg:pb-0">
                        <CardHome 
                            title="LAWYERS"
                            desc="Add or view Lawyers"
                            button1="Add Lawyer"
                            button2="View Lawyers"
                            link1="/lawyers"
                            link2="/lawyers/view"
                        />
                    </div>

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
                    <div className="pb-10 lg:pb-0">
                        <CardHome 
                            title=""
                            desc=""
                            button1=""
                            button2=""
                            link1=""
                            link2=""
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home