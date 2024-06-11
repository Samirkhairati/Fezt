import { Link } from "react-router-dom"
function Home() {
    return (
        <div className="relative flex h-screen py-20 px-5 w-full items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://i.imgur.com/CXDhpUS.png')] bg-cover bg-center" />
            <div className="flex flex-col w-full h-full gap-4 justify-center items-center relative z-10 max-w-md">
                <div className="w-full h-[40%] flex flex-row gap-4">
                    <Link to='/user/events' className="w-[60%] md:hover:scale-105 transition-transform ease-in-out duration-300 relative h-full border-white border-4 bg-[url('https://i.imgur.com/r7bvMw8.png')] bg-cover bg-center font-black">
                        <div className="absolute flex flex-col top-3 left-3">
                            <div className="text-4xl text-white opacity-80">EVENTS</div>
                            <div className="mt-1 text-xs text-white opacity-55">WORKSHOPS<br />COMPETITIONS<br /> GAMES</div>
                        </div>
                        <img className='absolute bottom-3 right-0 transform -rotate-[58deg] translate-x-[30%]' src='https://i.imgur.com/FwUsVvL.png' />
                    </Link>
                    <Link to='/user/wallet' className="w-[40%] md:hover:scale-105 transition-transform ease-in-out duration-300 relative h-full border-white border-4 bg-[url('https://i.imgur.com/AkXh4TV.png')] bg-cover bg-center font-black">
                        <div className="absolute transofrm -rotate-[90deg] bottom-4 left-5 -translate-y-1/4 -translate-x-1/4 flex flex-col">
                            <div className="text-4xl text-white opacity-80">WALLET</div>
                            <div className="mt-1 text-[10px] text-white opacity-60">CHECK YOUR<br />BALANCE & PROFILE<br/>LOGOUT</div>
                        </div>
                        <img className='absolute top-0 right-0 transform rotate-[20deg] translate-x-[30%]' src='https://i.imgur.com/N9ePOS3.png' />
                    </Link>
                </div>
                <div className="w-full h-[40%] flex flex-row gap-4">
                    <Link to='/user/orders' className="w-[45%] md:hover:scale-105 transition-transform ease-in-out duration-300 relative h-full border-white border-4 bg-[url('https://i.imgur.com/ztFyrbl.png')] bg-cover bg-center font-black">
                        <div className="absolute transform rotate-[90deg] flex flex-col translate-y-1/2 translate-x-1/4 top-3 right-3">
                            <div className="text-4xl text-white opacity-80 ">ORDERS</div>
                            <div className="mt-1 text-xs text-white opacity-65">SEE ALL<br />TRANSACTIONS</div>
                        </div>
                        <img className='absolute bottom-0 left-0 transform scale-110 -rotate-[45deg] -translate-x-[25%] translate-y-[20%]' src='https://i.imgur.com/mJYS0QJ.png' />
                    </Link>
                    <Link to='/user/shop' className="w-[55%] md:hover:scale-105 transition-transform ease-in-out duration-300 relative h-full border-white border-4 bg-[url('https://i.imgur.com/kfZRxhl.png')] bg-cover bg-center font-black">
                        <div className="absolute flex flex-col top-3 left-3">
                            <div className="text-4xl text-white opacity-80">SHOP</div>
                            <div className="mt-1 text-xs text-white opacity-55">BUY FOOD<br />AND PRODUCTS</div>
                        </div>
                        <img className='absolute bottom-0 right-0 transform -rotate-[10deg] translate-x-[15%] translate-y-[10%]' src='https://i.imgur.com/NegscVX.png' />
                    </Link>
                </div>
                <div className="w-full h-[20%] flex flex-row gap-4">
                    <Link to='/user/dashboard' className="w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 relative h-full border-white border-4 bg-[url('https://i.imgur.com/thNwZZQ.png')] bg-cover bg-center font-black">
                        <div className="absolute flex flex-col top-3 left-3">
                            <div className="text-4xl text-white opacity-80">DASHBOARD</div>
                            <div className="mt-1 text-xs text-white opacity-55">MANAGE CLUBS<br />AND EVENTS</div>
                        </div>
                        <img className='absolute bottom-0 right-0 transform h-full w-auto -rotate-[0] scale-150 translate-x-[5%] translate-y-[10%]' src='https://i.imgur.com/nGLlHyI.png' />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home