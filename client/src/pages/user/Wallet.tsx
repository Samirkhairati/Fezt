/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaArrowLeft } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useStore from "@/actions/store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "../../../../server/models/user.model";
import { getAuth, signOut } from "firebase/auth";
import firebase from "@/lib/firebase";

interface EventSchema {
    _id: string;
    name: string;
    image?: string;
    price?: number;
    date?: string;
    registrations?: number;
    club: {
        _id: string;
        name: string;
    },
    registered?: string[];
}

//TODO: better credit card design

function Wallet() {

    const userId = useStore(state => state.user?._id);
    const setUser = useStore(state => state.setUser);
    const navigate = useNavigate();

    async function readEventsByUser() {
        const response = await axios.get('/api/events/club', { params: { userId } });
        return response.data;
    }
    const { data: events, isLoading } = useQuery({
        queryKey: ['events', userId],
        queryFn: readEventsByUser,
        enabled: !!userId
    });

    async function getUser() {
        const response = await axios.get('/api/users', { params: { userId } });
        return response.data;
    }
    const { data: user } = useQuery<IUser>({
        queryKey: ['users', userId],
        queryFn: getUser,
        enabled: !!userId
    });

    const logout = async () => {
        const auth = getAuth(firebase)
        await signOut(auth)
        await axios.post('/api/users/logout');
        setUser(null);
        localStorage.removeItem('user');
        toast.success('Logged out successfully')
        navigate('/')
    }


    return (
        <div className="relative flex h-screen overflow-y-scroll pt-5 pb-10 px-5 w-full items-center justify-center bg-[url('/pattern1.png')] bg-cover bg-center">
            <div className="flex flex-col w-full h-full gap-8 justify-start items-center max-w-md pb-20">
                <div className="flex flex-row items-center justify-between w-full py-4 px-0">
                    <button onClick={() => navigate('/user/home')} className="h-full opacity-80"><FaArrowLeft className="text-4xl text-white" /></button>
                    <div className="h-full text-center text-5xl opacity-80 font-black text-white">WALLET</div>
                    <button onClick={() => logout()} className="h-full opacity-80"><LuLogOut className="text-4xl text-white" /></button>
                </div>
                <div className="h-[250px] flex w-full relative my-10 flex-shrink-0">
                    <div className="border-2 border-black border-opacity-45 rounded-3xl absolute z-30 w-full h-[250px] justify-between items-center flex px-8 md:px-12 bg-[#e6da99]">
                        <div>
                            <p className="text-black opacity-50 leading-tight text-4xl md:text-6xl font-bold mb-2">₹{user?.balance}</p>
                            <p className="text-black opacity-40 leading-tight text-lg font-bold">{user?.name}</p>
                            <p className="text-black opacity-40 leading-tight font-bold">{user?.bits}</p>
                            <p className="text-black opacity-30 leading-tight text-[10px]">{user?.email}</p>
                            <p className="text-black opacity-30 leading-tight text-[10px]">{user?.address}</p>
                            <p className="text-black opacity-30 leading-tight text-[10px]">{user?.phone}</p>
                        </div>
                        <img className="w-24 h-24 rounded-full grayscale opacity-35" src={user?.image} alt="User Avatar" />

                    </div>
                    <div className="transform rotate-[5deg] rounded-3xl absolute z-20 w-full h-full bg-[#685807]"></div>
                    <div className="transform rotate-[10deg] rounded-3xl absolute z-10 w-full h-full bg-[#2f2504]"></div>
                </div>
                <h2 className="text-center mb-3 text-3xl text-white font-bold opacity-80">YOUR EVENTS</h2>
                {events?.length === 0 && !isLoading && <p className="text-center text-white opacity-50">No events found.</p>}
                {isLoading ? <Loader2 className="w-full text-white text-center" /> :
                    events?.map((event: EventSchema) => (
                        <div key={event._id} className="w-full h-[170px] md:h-[25%] flex flex-row gap-4">
                            <div className={`relative flex items-center justify-start w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 h-full border-white border-4 bg-[url('/pattern2.png')] bg-cover bg-center`}>
                                <img className='grayscale opacity-80 contrast-150 object-cover h-full aspect-square border-white' src={event.image} />
                                <div className="py-3 px-7 flex flex-col justify-center h-full">
                                    <h2 className="text-xs md:text-lg font-extrabold uppercase leading-tight text-wrap text-black opacity-90">{event.name}</h2>
                                    <p className="text-xs md:text-sm mt-1 font-bold text-black opacity-60 leading-tight">{event.club.name}</p>
                                    <p className="text-xs md:text-sm font-bold text-black opacity-60 leading-tight">{event.date}</p>
                                    <p className="text-xs md:text-base font-extrabold text-black opacity-80 leading-tight">₹ {event.price || 'FREE'}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
                <div className="h-10 w-full opacity-0">.</div>
            </div>

        </div>
    );
}

export default Wallet;
