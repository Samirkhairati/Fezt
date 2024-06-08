import Wrapper from "@/components/Wrapper"
import { Link } from "react-router-dom"
function Home() {

    //TODO: custom props
    return (
        <Wrapper redirect="/user/home" title="DASHBOARD">
            <div className="w-full h-[20%] flex flex-row gap-4">
                <Link to='/vendor/orders' className="w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 relative h-full border-white border-4 bg-[url('/pattern2.png')] bg-cover bg-center font-black">
                    <div className="absolute flex flex-col top-3 left-3">
                        <div className="text-5xl text-white opacity-80">ORDERS</div>
                        <div className="mt-1 text-md text-white opacity-55">MANAGE ORDERS</div>
                    </div>
                    <img className='absolute bottom-0 right-0 transform h-full w-auto -rotate-[0] scale-150 translate-x-[5%] -translate-y-[10%]' src='/prop9.png' />
                </Link>
            </div>
            <div className="w-full h-[20%] flex flex-row gap-4">
                <Link to='/vendor/items' className="w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 relative h-full border-white border-4 bg-[url('/pattern4.png')] bg-cover bg-center font-black">
                    <div className="absolute flex flex-col top-3 left-3">
                        <div className="text-5xl text-white opacity-80">ITEMS</div>
                        <div className="mt-1 text-md text-white opacity-80">MANAGE ITEMS</div>
                    </div>
                    <img className='absolute bottom-0 right-0 transform h-full w-auto rotate-[20deg] scale-[1.5] translate-x-[5%] translate-y-[10%]' src='/prop8.png' />
                </Link>
            </div>
        </Wrapper>
    )
}
export default Home

