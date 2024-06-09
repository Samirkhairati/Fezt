/* eslint-disable @typescript-eslint/no-explicit-any */
import Wrapper from "@/components/Wrapper"
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
// import useStore from "@/actions/store";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ItemSchema {
    _id: string;
    name: string;
    image?: string;
    price?: number;
    vendor: {
        _id: string;
        name: string;
        image?: string;
    },
}

function Shop() {

    //const vendorId = useStore(state => state.vendor?._id);

    async function fetchItems({ pageParam = 1 }) {
        const response = await axios.get(`/api/items?page=${pageParam}`);
        return response.data;
    }
    const { data, error, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['items'],
        queryFn: fetchItems,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
    });

    const { ref, inView } = useInView();
    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [fetchNextPage, inView]);
    const items = data?.pages.flatMap(page => page.data) || [];

    return (
        <Wrapper redirect="/user/home" title="SHOP">
            {items.length === 0 && status === 'success' && <div className="text-center text-white">No events available</div>}
            {status === 'pending' ? (
                <Loader2 className="w-full text-white text-center" />
            ) : status === 'error' ? (
                <div>{error.message}</div>
            ) : (
                <>
                    {items.map((item: ItemSchema) => (
                        <div key={item._id} className="w-full h-[170px] md:h-[25%] flex flex-row gap-4">
                            <div className={`relative flex items-center justify-start w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 h-full border-white border-4 bg-[url('/pattern5.png')] bg-cover bg-center`}>
                                <img className='h-full object-contain aspect-square border-white' src={item.image} />
                                <div className="py-3 px-7 flex flex-col justify-center h-full">
                                    <h2 className="text-xs md:text-xl font-extrabold uppercase leading-tight text-wrap text-black opacity-90">{item.name}</h2>
                                    <p className="text-xs md:text-base mt-1 font-bold text-black opacity-80 leading-tight flex items-center gap-1">
                                        <Avatar className="w-5 h-5 border-[1px] p-[2px] bg-white border-gray-50 ">
                                            <img src={item.vendor.image} alt="User Avatar" />
                                        </Avatar>
                                        {item.vendor.name}</p>
                                    <p className="text-xs md:text-xl font-extrabold text-black opacity-80 leading-tight">₹ {item.price || 'FREE'}</p>
                                    <div className="absolute right-2 bottom-2 flex">
                                        <Button type="button" size='icon' className="bg-slate-950 text-white text-xs w-6 h-6 rounded-none rounded-l-sm">-</Button>
                                        <Button type="button" size='icon' disabled={true} className="bg-white text-black text-xs w-6 h-6 rounded-none ">0</Button>
                                        <Button type="button" size='icon' className="bg-slate-950 text-white text-xs w-6 h-6 rounded-none rounded-r-sm ">+</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={ref}>{isFetchingNextPage && <Loader2 className="w-full text-white text-center" />}</div>
                </>
            )}
        </Wrapper>
    );
}

export default Shop;
