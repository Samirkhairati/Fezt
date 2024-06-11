import useStore from "@/actions/store";
import Wrapper from "@/components/Wrapper"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom"

interface VendorSchema {
    _id: string;
    name: string;
    image?: string;
}

function Vendors() {

    const userId = useStore(state => state.user?._id);

    const readVendors = async () => {
        const response = await axios.get('/api/vendors');
        return response.data;
    }
    const { data: vendors, isLoading: readIsLoading } = useQuery({
        queryKey: ['vendors'],
        queryFn: readVendors,
        enabled: !!userId
    });

    return (
        <Wrapper redirect="/user/home" title="VENDORS">
            {readIsLoading ? <Loader2 className="w-full text-white text-center" /> :
                vendors?.map((vendor: VendorSchema) => (
                    <div className="w-full h-[15%] flex flex-row gap-4">
                        <Link to={`/user/shop/${vendor._id}`} className="flex items-center w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 relative h-full border-white border-4 bg-[url('/pattern5.png')] bg-cover bg-center font-black">
                            <div className="text-4xl pl-10 text-white opacity-80 text-center">{vendor.name}</div>
                            <img className='absolute bottom-0 right-0 transform h-full w-auto' src={vendor.image} />
                        </Link>
                    </div>
                ))
            }
        </Wrapper>
    )
}

export default Vendors

