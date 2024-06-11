/* eslint-disable @typescript-eslint/no-explicit-any */
import Wrapper from "@/components/Wrapper"
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import useStore from "@/actions/store";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IoMdArrowDropright } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

//TODO: refactor into components everything

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

    const { vendorId } = useParams();
    const navigate = useNavigate();
    const cart = useStore(state => state.cart);
    const setcart = useStore(state => state.setCart);

    async function fetchItems({ pageParam = 1 }) {
        const response = await axios.get('/api/items', { params: { page: pageParam, vendorId } });
        return response.data;
    }
    const { data, error, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['items', vendorId],
        queryFn: fetchItems,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
    });

    const addToCart = (itemId: string, itemName: string, itemPrice: number, action: '+' | '-') => {
        const item = cart?.find(cartItem => cartItem._id === itemId);
        const newCart = [...cart];
        if (item) {
            if (action === '+') {
                item.quantity += 1;
            } else if (action === '-' && item.quantity > 0) {
                item.quantity -= 1;
                if (item.quantity === 0) {
                    newCart.splice(newCart.findIndex(cartItem => cartItem._id === itemId), 1);
                }
            }
        } else {
            newCart.push({ _id: itemId, quantity: 1, vendorId: vendorId as string, itemName: itemName as string, itemPrice: itemPrice as number });
        }
        setcart(newCart);
    }

    const { ref, inView } = useInView();
    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [fetchNextPage, inView]);
    const items = data?.pages.flatMap(page => page.data) || [];

    return (
        <Wrapper redirect="/user/shop" title="SHOP">
            <Button disabled={!cart?.length} onClick={() => navigate(`/user/shop/${vendorId}/cart`)} className="w-full gap-4 justify-center bottom-20 bg-slate-800 text-lg shadow-xl h-14 max-w-md font-black text-purple-300">
                <span>CART:</span>
                <span className="ml-1">₹{cart?.reduce((total, item) => total + (item.quantity * (items?.find(i => i._id === item._id)?.price || 0)), 0)}</span>
                <span className="text-3xl"><IoMdArrowDropright /></span>
            </Button>
            {!items?.length && status === 'success' && <div className="text-center text-white">No items available</div>}
            {status === 'pending' ? (
                <Loader2 className="w-full text-white text-center" />
            ) : status === 'error' ? (
                <div>{error.message}</div>
            ) : (
                <>
                    {items?.map((item: ItemSchema) => (
                        <div key={item._id} className="w-full h-[170px] md:h-[25%] flex flex-row gap-4">
                            <div className={`relative flex items-center justify-start w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 h-full border-white border-4 bg-[url('/pattern5.png')] bg-cover bg-center`}>
                                <img className='h-full object-contain aspect-square border-white' src={item.image} />
                                <div className="py-3 px-7 flex flex-col justify-center h-full">
                                    <h2 className="text-xs md:text-xl font-extrabold uppercase leading-tight text-wrap text-black opacity-90">{item.name}</h2>
                                    <p className="text-xs md:text-base mt-2 font-bold text-black opacity-80 leading-tight flex items-center gap-1">
                                        <Avatar className="w-5 h-5 border-[1px] p-[2px] bg-white border-gray-50 ">
                                            <img src={item.vendor.image} alt="User Avatar" />
                                        </Avatar>
                                        {item.vendor.name}</p>
                                    <p className="text-xs md:text-xl font-extrabold text-black opacity-80 leading-tight mt-1 onclick={}">₹ {item.price || 'FREE'}</p>
                                    <div className="absolute right-2 bottom-2 flex">
                                        <Button onClick={() => addToCart(item._id, item.name, item.price as number, '-')} type="button" size='icon' className="bg-slate-950 text-white text-xs w-6 h-6 rounded-none rounded-l-sm">-</Button>
                                        <Button type="button" size='icon' disabled={true} className="bg-white text-black text-xs w-6 h-6 rounded-none ">{cart?.find(cartItem => cartItem._id === item._id)?.quantity || 0}</Button>
                                        <Button onClick={() => addToCart(item._id, item.name, item.price as number, '+')} type="button" size='icon' className="bg-slate-950 text-white text-xs w-6 h-6 rounded-none rounded-r-sm ">+</Button>
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
