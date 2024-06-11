import { useNavigate } from 'react-router-dom'

function Start() {

    const navigate = useNavigate()

    return (
        <>
            <div className="relative flex min-h-screen pb-10 w-full items-center justify-center bg-[url('/splash.png')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <div className="flex flex-col items-center gap-8 relative z-10 w-[70%] md:w-[400px]">
                    <div className="flex items-center gap-2 mt-8 w-full justify-center">
                        <span className="text-9xl font-black text-rose-500 shadow-2xl text-center opacity-90">FezT</span>
                    </div>
                    <div className='h-[500px]  flex flex-col w-full flex-shrink-0 gap-10 mt-10'>
                        <div onClick={() => navigate('/login/user')} className="cursor-pointer w-full h-[150px] flex flex-row gap-4 opacity-80 hover:opacity-100 transition-opacity">
                            <div  className="items-center w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 relative h-full border-white border-4 bg-[url('/pattern6.png')] bg-cover bg-center font-black">
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-5xl md:text-6xl text-white opacity-70">STUDENT</div>
                                </div>
                                <img className='absolute bottom-0 right-0 transform h-full w-auto rotate-[0deg] translate-x-[50%] scale-100 translate-y-[20%]' src='/prop7.png' />

                            </div>
                        </div>
                        <div onClick={() => navigate('/login/vendor')} className="cursor-pointer w-full h-[150px] flex flex-row gap-4 opacity-80 hover:opacity-100 transition-opacity">
                            <div  className="w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 relative h-full border-white border-4 bg-[url('/pattern5.png')] bg-cover bg-center font-black">
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-5xl md:text-6xl text-white opacity-70">VENDOR</div>
                                </div>
                                <img className='absolute bottom-0 right-0 transform h-full w-auto rotate-[20deg] translate-x-[50%] scale-125 translate-y-[20%]' src='/prop8.png' />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Start
