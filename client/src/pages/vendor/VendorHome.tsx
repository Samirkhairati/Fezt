import { TbLogout2 } from "react-icons/tb";
import { Link } from "react-router-dom"
import useStore from "@/actions/store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Home() {

    const setVendor = useStore(state => state.setVendor);
    const navigate = useNavigate();
    const logout = async () => {
        await axios.post('/api/vendors/logout');
        setVendor(null);
        localStorage.removeItem('vendor');
        toast.success('Logged out successfully')
        navigate('/')
    }
    //TODO: move images to CDN
    return (
        <div className="relative flex h-screen overflow-y-scroll pt-5 pb-10 px-5 w-full items-center justify-center bg-[url('/pattern1.png')] bg-cover bg-center">
            <div className="flex flex-col w-full h-full gap-7 justify-start items-center max-w-md pb-20">
                <div className="flex flex-row items-center justify-between w-full py-4 px-0">
                    <button onClick={() => logout()} className="h-full opacity-80"><TbLogout2 className="text-4xl text-white" /></button>
                    <div className="h-full text-center text-5xl opacity-80 font-black text-white">VENDOR</div>
                    <div className="h-full opacity-0"><TbLogout2 className="text-4xl text-white" /></div>
                </div>
                <div className="w-full h-[20%] flex flex-row gap-4">
                    <Link to='/vendor/orders' className="w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 relative h-full border-white border-4 bg-[url('/pattern2.png')] bg-cover bg-center font-black">
                        <div className="absolute flex flex-col top-3 left-3">
                            <div className="text-5xl text-white opacity-80">ORDERS</div>
                            <div className="mt-1 text-md text-white opacity-55">MANAGE ORDERS</div>
                        </div>
                        <img className='absolute bottom-0 right-0 transform h-full w-auto -rotate-[0deg] scale-[1.4] translate-x-[5%] -translate-y-[10%]' src='/prop9.png' />
                    </Link>
                </div>
                <div className="w-full h-[20%] flex flex-row gap-4">
                    <Link to='/vendor/items' className="w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 relative h-full border-white border-4 bg-[url('/pattern3.png')] bg-cover bg-center font-black">
                        <div className="absolute flex flex-col top-3 left-3">
                            <div className="text-5xl text-white opacity-80">ITEMS</div>
                            <div className="mt-1 text-md text-white opacity-80">MANAGE ITEMS</div>
                        </div>
                        <img className='absolute bottom-0 right-0 transform h-full w-auto rotate-[20deg] scale-[1.5] translate-x-[5%] translate-y-[10%]' src='/prop8.png' />
                    </Link>
                </div>
                <div className="w-full h-[20%] flex flex-row gap-4">
                    <Link to='/vendor/finances' className="w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 relative h-full border-white border-4 bg-[url('/pattern4.png')] bg-cover bg-center font-black">
                        <div className="absolute flex flex-col top-3 left-3">
                            <div className="text-5xl text-white opacity-70">FINANCES</div>
                            <div className="mt-1 text-md text-white opacity-70">SEE YOUR BALANCE</div>
                        </div>
                        <img className='absolute bottom-0 right-0 transform h-full w-auto rotate-[0deg] scale-[1.5] translate-x-[5%] translate-y-[10%]' src='/prop10.png' />
                    </Link>
                </div>
                <div className="h-10 w-full opacity-0">.</div>
            </div>
            ]
        </div>

    )
}
export default Home

