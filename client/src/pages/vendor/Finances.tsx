/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaArrowLeft } from "react-icons/fa";
import useStore from "@/actions/store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { IVendor } from "../../../../server/models/vendor.model";

//TODO: PWA

function Finances() {

    const vendorId = useStore(state => state.vendor?._id);
    const navigate = useNavigate();

    async function getUser() {
        const response = await axios.get('/api/vendors/profile', { params: { vendorId } });
        return response.data;
    }
    const { data: vendor } = useQuery<IVendor>({
        queryKey: ['users', vendorId],
        queryFn: getUser,
        enabled: !!vendorId
    });

    return (
        <div className="relative flex h-screen overflow-y-scroll pt-5 pb-10 px-5 w-full items-center justify-center bg-[url('/pattern1.png')] bg-cover bg-center">
            <div className="flex flex-col w-full h-full gap-8 justify-start items-center max-w-md pb-20">
                <div className="flex flex-row items-center justify-between w-full py-4 px-0">
                    <button onClick={() => navigate('/vendor/home')} className="h-full opacity-80"><FaArrowLeft className="text-4xl text-white" /></button>
                    <div className="h-full text-center text-5xl opacity-80 font-black text-white">FINANCES</div>
                    <button className="h-full opacity-0"><FaArrowLeft className="text-4xl text-white" /></button>

                </div>
                <div className="h-[250px] flex w-full relative my-10 flex-shrink-0">
                    <div className="border-2 border-black border-opacity-45 rounded-3xl absolute z-30 w-full h-[250px] justify-between items-center flex px-8 md:px-12 bg-[url('/pattern4.png')] bg-cover bg-center">
                        <div>
                            <p className="text-black opacity-50 leading-tight text-4xl md:text-6xl font-bold mb-2">₹ {vendor?.balance}</p>
                            <p className="text-black opacity-40 leading-tight text-lg font-bold">{vendor?.name}</p>
                            <p className="text-black opacity-30 leading-tight text-[10px]">{vendor?.email}</p>
                            <p className="text-black opacity-30 leading-tight text-[10px]">{vendor?.address}</p>
                            <p className="text-black opacity-30 leading-tight text-[10px]">{vendor?.phone}</p>
                        </div>
                        <img className="w-24 h-24 rounded-full grayscale opacity-35" src={vendor?.image} alt="User Avatar" />

                    </div>
                    <div className="transform rotate-[5deg] rounded-3xl absolute z-20 w-full h-full bg-[#5b6807]"></div>
                    <div className="transform rotate-[10deg] rounded-3xl absolute z-10 w-full h-full bg-[#272f04]"></div>
                </div>
                <div className="h-10 w-full opacity-0">.</div>
            </div>

        </div>
    );
}

export default Finances;
