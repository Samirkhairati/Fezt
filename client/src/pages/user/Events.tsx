/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { FaCheck } from "react-icons/fa";
import Wrapper from "@/components/Wrapper"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useStore from "@/actions/store";

interface RegisterEvent {
    eventId: string,
    clubId: string,
    userId: string,
}

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

function EventsDashboard() {

    const { register, handleSubmit, reset } = useForm<RegisterEvent>();
    const userId = useStore(state => state.user?._id);
    const queryClient = useQueryClient();

    async function fetchItems({ pageParam = 1 }) {
        const response = await axios.get(`/api/events?page=${pageParam}`);
        console.log(response.data)
        return response.data;
    }
    const { data, error, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['events'],
        queryFn: fetchItems,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
    });

    const registerEvent = async (data: RegisterEvent) => {
        const response = await axios.put('/api/events/register', { ...data });
        return response.data;
    };
    const { mutate: registerEventMutation, isPending: registerIsPending } = useMutation({
        mutationFn: registerEvent,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['events'] });
            reset();
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
            reset()
        }
    });
    const onSubmit = (data: RegisterEvent) => {
        registerEventMutation(data);
    };

    const { ref, inView } = useInView();
    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [fetchNextPage, inView]);
    const items = data?.pages.flatMap(page => page.data) || [];

    return (
        <Wrapper redirect="/user/home" title="EVENTS">
            {!items?.length && status === 'success' && <div className="text-center text-white">No events available</div>}
            {status === 'pending' ? (
                <Loader2 className="w-full text-white text-center" />
            ) : status === 'error' ? (
                <div>{error.message}</div>
            ) : (
                <>
                    {items?.map((event: EventSchema) => (
                        <div key={event._id} className="w-full h-[170px] md:h-[25%] flex flex-row gap-4">
                            <div className={`relative flex items-center justify-start w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 h-full border-white border-4 bg-[url('/pattern2.png')] bg-cover bg-center`}>
                                <img className='grayscale opacity-80 contrast-150 object-cover h-full aspect-square border-white' src={event.image} />
                                <div className="py-3 px-7 flex flex-col justify-center h-full">
                                    <h2 className="text-xs md:text-lg font-extrabold uppercase leading-tight text-wrap text-black opacity-90">{event.name}</h2>
                                    <p className="text-xs md:text-sm mt-1 font-bold text-black opacity-60 leading-tight">{event.club.name}</p>
                                    <p className="text-xs md:text-sm font-bold text-black opacity-60 leading-tight">{event.date}</p>
                                    <p className="text-xs md:text-base font-extrabold text-black opacity-80 leading-tight">₹ {event.price || 'FREE'}</p>
                                    <div className="absolute right-2 bottom-2 flex-col flex gap-1">
                                        {event.registered?.includes(userId as string) ? <Button disabled={true} size='icon' className="bg-black text-white border-opacity-80 border-white text-xs border-2"><FaCheck /></Button>
                                            : <Dialog>
                                                <DialogTrigger>
                                                    <Button className="bg-rose-500 text-white border-opacity-80 border-white text-xs border-2">Register</Button>
                                                </DialogTrigger>
                                                <DialogContent className="">
                                                    <DialogHeader>
                                                        <DialogTitle className="leading-normal">Are you sure you want to delete this event? It will cost you ₹{event.price}</DialogTitle>
                                                        <DialogDescription>
                                                            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-2 mt-2">
                                                                <input type="hidden" value={event.club._id} {...register('clubId')} />
                                                                <input type="hidden" value={event._id} {...register('eventId')} />
                                                                <input type="hidden" value={userId} {...register('userId')} />
                                                                <Button disabled={registerIsPending} type="submit" className="w-full mt-5">
                                                                    {registerIsPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                    Register for {event.name}
                                                                </Button>
                                                            </form>
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>
                                        }

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

export default EventsDashboard;
