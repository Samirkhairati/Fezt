import Wrapper from "@/components/Wrapper"
import { Link } from "react-router-dom"
function Dashboard() {
    return (
        <Wrapper redirect="/user/home" title="DASHBOARD">
            <div className="w-full h-[20%] flex flex-row gap-4">
                <Link to='/user/dashboard/clubs' className="w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 relative h-full border-white border-4 bg-[url('https://i.imgur.com/kfZRxhl.png')] bg-cover bg-center font-black">
                    <div className="absolute flex flex-col top-3 left-3">
                        <div className="text-5xl text-white opacity-80">CLUBS</div>
                        <div className="mt-1 text-md text-white opacity-55">MANAGE CLUBS</div>
                    </div>
                    <img className='absolute bottom-0 right-0 transform h-full w-auto -rotate-[0] scale-150 translate-x-[5%] -translate-y-[10%]' src='https://i.imgur.com/MHgIc10.png' />
                </Link>
            </div>
            <div className="w-full h-[20%] flex flex-row gap-4">
                <Link to='/user/dashboard/events' className="w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 relative h-full border-white border-4 bg-[url('https://i.imgur.com/thNwZZQ.png')] bg-cover bg-center font-black">
                    <div className="absolute flex flex-col top-3 left-3">
                        <div className="text-5xl text-white opacity-70">EVENTS</div>
                        <div className="mt-1 text-md text-white opacity-75">MANAGE EVENTS</div>
                    </div>
                    <img className='absolute bottom-0 right-0 transform h-full w-auto -rotate-[0] translate-x-[5%] scale-125 -translate-y-[10%]' src='https://i.imgur.com/l0Avezw.png' />
                </Link>
            </div>
        </Wrapper>
    )
}

export default Dashboard

