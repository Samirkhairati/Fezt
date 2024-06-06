import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Wrapper({ children, redirect, title }: { children: React.ReactNode, redirect: string, title: string }) {

    const navigate = useNavigate();

    return (
        <div className="relative flex h-screen overflow-y-scroll pt-5 pb-10 px-5 w-full items-center justify-center">
            <div className="absolute inset-0 bg-[url('/pattern1.png')] bg-cover bg-center" />
            <div className="flex flex-col w-full h-full gap-10 justify-start items-center relative z-10 max-w-md">
                <div className="flex flex-row items-center justify-between w-full py-4 px-0">
                    <button onClick={() => navigate(redirect)} className="h-full opacity-80"><FaArrowLeft className="text-4xl text-white" /></button>
                    <div className="h-full text-center text-5xl opacity-80 font-black text-white">{title}</div>
                    <div className="h-full opacity-0"><FaArrowLeft className="text-4xl text-white" /></div>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Wrapper