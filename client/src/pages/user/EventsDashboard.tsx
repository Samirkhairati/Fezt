/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import Wrapper from "@/components/Wrapper"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useStore from "@/actions/store";
import { MdEdit } from "react-icons/md";
import { useState } from "react";
//TODO: use lesser interfaces
interface CreateEvent {
    name: string,
    image: string,
    price: number,
    date: string,
    club: string,
    _id: string,
}
interface EditEvent {
    name: string,
    image: string,
    price: number,
    date: string,
    _id: string,
    club: string,
}
interface DeleteEvent {
    _id: string,
    club: string,
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
    }
}

function EventsDashboard() {

    const { register: registerCreate, handleSubmit: handleSubmitCreate, reset: resetCreate, setValue: setValueCreate, formState: { errors: errorsCreate } } = useForm<CreateEvent>();
    const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm<EditEvent>();
    const { register: registerDelete, handleSubmit: handleSubmitDelete, reset: resetDelete } = useForm<DeleteEvent>();
    const queryClient = useQueryClient();
    const userId = useStore(state => state.user?._id);
    const [fileLoading, setFileLoading] = useState(false);
    const [image, setImage] = useState<string | undefined>(undefined);

    const readEventsByUser = async () => {
        const response = await axios.get('/api/events/club', { params: { userId } });
        return response.data;
    }

    const readUserClubs = async () => {
        const response = await axios.get('/api/clubs/user', { params: { userId } });
        return response.data;
    }

    const createEvent = async (data: CreateEvent) => {
        const response = await axios.post('/api/events', { ...data, image });
        return response.data;
    };

    const editEvent = async (data: EditEvent) => {
        const response = await axios.put('/api/events', { ...data, image });
        return response.data;
    };

    const deleteEvent = async (data: DeleteEvent) => {
        const response = await axios.delete('/api/events', { params: { ...data } });
        return response.data;
    };

    const { data: events, isLoading: readIsLoading } = useQuery({
        queryKey: ['events', userId],
        queryFn: readEventsByUser,
        enabled: !!userId
    });
    const { data: clubs } = useQuery({
        queryKey: ['clubs', userId],
        queryFn: readUserClubs,
        enabled: !!userId
    });

    const { mutate: createEventMutation, isPending: createIsPending } = useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            toast.success("Event created successfully.");
            queryClient.invalidateQueries({ queryKey: ['events', userId] });
            setImage(undefined);
            resetCreate();
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
            resetCreate();
        }
    });
    const { mutate: editEventMutation, isPending: editIsPending } = useMutation({
        mutationFn: editEvent,
        onSuccess: () => {
            toast.success("Event edited successfully.");
            queryClient.invalidateQueries({ queryKey: ['events', userId] });
            setImage(undefined);
            resetEdit();
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
            resetEdit();
        }
    });
    const { mutate: deleteEventMutation, isPending: deleteIsPending } = useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            toast.success("Event deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ['events', userId] });
            resetDelete();
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
            resetDelete();
        }
    });

    const onSubmitCreate = (data: CreateEvent) => {
        createEventMutation(data);
    };
    const onSubmitEdit = (data: EditEvent) => {
        editEventMutation(data);
    };
    const onSubmitDelete = (data: DeleteEvent) => {
        deleteEventMutation(data);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const data = new FormData();
        data.append('file', e.target.files![0]);
        data.append('upload_preset', 'preset');

        try {
            setFileLoading(true)
            const file = await axios.post('https://api.cloudinary.com/v1_1/dkytadhg9/auto/upload', data)
            setImage(file.data.secure_url);
        } catch (error) {
            toast.error("Couldn't upload image")
        } finally {
            setFileLoading(false)
        }
    }

    //TODO: convert patterns to css
    return (
        <Wrapper redirect="/user/dashboard" title="EVENTS">
            <Dialog>
                <DialogTrigger>
                    <Button className="w-full bg-white text-black hover:bg-slate-200"><FaPlus className="mr-3" />New Event</Button>
                </DialogTrigger>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>Create a New Event</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={handleSubmitCreate(onSubmitCreate)} className="w-full flex flex-col gap-y-2 mt-2">
                                <Input
                                    placeholder="Event Name"
                                    className="w-full"
                                    {...registerCreate("name", { required: true })}
                                />
                                {errorsCreate.name && <p className="text-red-500">Event Name is required</p>}
                                <Input
                                    placeholder="Date: 7 June 8:00 PM"
                                    className="w-full"
                                    {...registerCreate("date", { required: true })}
                                />
                                {errorsCreate.date && <p className="text-red-500">Date is required</p>}
                                <Input
                                    placeholder="Price: Type 0 for free events."
                                    className="w-full"
                                    type="number"
                                    {...registerCreate("price", { required: true, valueAsNumber: true, min: 0 })}
                                />
                                {errorsCreate.price && <p className="text-red-500">Price is required</p>}
                                {!clubs?.length ? <p className="text-red-500">Create a club first</p> :
                                    <Select onValueChange={(value: string) => setValueCreate('club', value, { shouldValidate: true })} {...registerCreate("club", { required: true })}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Club" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clubs?.map((club: any, index: number) => (
                                                <SelectItem key={index} value={club._id}>{club.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>}
                                {errorsCreate.club && <p className="text-red-500">Club is required</p>}
                                <div className="flex gap-4 items-center my-2">
                                    <img className="h-20 w-20 object-cover rounded-lg" src={image || 'https://semantic-ui.com/images/wireframe/image.png'} />
                                    <div className="flex flex-col gap-1 justify-center">
                                        <Button type="button" disabled={fileLoading} variant='outline'>
                                            <label
                                                className="cursor-pointer"
                                                htmlFor="media"
                                            >
                                                Upload Event Image
                                                <input onChange={handleFileChange} accept="image/*" className="sr-only" id="media" name="media" type="file" />
                                            </label>
                                        </Button>
                                        <Button disabled={!image} onClick={() => setImage(undefined)} variant='outline' >Remove Upload</Button>
                                    </div>
                                </div>

                                <Button disabled={createIsPending || fileLoading} type="submit" className="w-full">
                                    {(createIsPending || fileLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create new Event
                                </Button>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            {readIsLoading ? <Loader2 className="w-full text-white text-center" /> :
                events?.length === 0 ? <p className="text-white text-center">No events created yet</p> :
                    events?.map((event: EventSchema, index: number) => (
                        <div key={index} className="w-full h-[170px] md:h-[25%] flex flex-row gap-4">
                            <div className={`relative flex items-center justify-start w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 h-full border-white border-4 bg-[url('/pattern2.png')] bg-cover bg-center`}>
                                <img className='grayscale opacity-80 contrast-150 object-cover h-full aspect-square border-white' src={event.image} />
                                <div className="py-3 px-7 flex flex-col justify-center h-full">
                                    <h2 className="text-xs md:text-lg font-extrabold uppercase leading-tight text-wrap text-black opacity-90">{event.name}</h2>
                                    <p className="text-xs md:text-sm mt-1 font-bold text-black opacity-60 leading-tight">{event.club.name}</p>
                                    <p className="text-xs md:text-sm font-bold text-black opacity-60 leading-tight">{event.date}</p>
                                    <p className="text-xs md:text-base font-extrabold text-black opacity-80 leading-tight">₹ {event.price || 'FREE'}</p>
                                    <p className="text-xs md:text-sm font-bold text-black opacity-60">Registrations: {event.registrations}</p>
                                    <div className="absolute right-2 bottom-2 flex-col flex gap-1">
                                        <Dialog>
                                            <DialogTrigger>
                                                <Button type="button" size='icon' className="bg-blue-500 text-white text-xs w-6 h-6 border-2 border-opacity-80 border-white"><MdEdit /></Button>
                                            </DialogTrigger>
                                            <DialogContent className="">
                                                <DialogHeader>
                                                    <DialogTitle>Edit Event</DialogTitle>
                                                    <DialogDescription>
                                                        <form onSubmit={handleSubmitEdit(onSubmitEdit)} className="w-full flex flex-col gap-y-2 mt-2">
                                                            <Input
                                                                placeholder="Event Name"
                                                                className="w-full"
                                                                {...registerEdit("name")}
                                                            />
                                                            {errorsEdit.name && <p className="text-red-500">Event Name is required</p>}
                                                            <Input
                                                                placeholder="Date: 7 June 8:00 PM"
                                                                className="w-full"
                                                                {...registerEdit("date")}
                                                            />
                                                            {errorsEdit.date && <p className="text-red-500">Date is required</p>}
                                                            <Input
                                                                placeholder="Price: Type 0 for free events."
                                                                className="w-full"
                                                                type="number"
                                                                {...registerEdit("price", { valueAsNumber: true, min: 0 })}
                                                            />
                                                            {errorsEdit.price && <p className="text-red-500">Price is required</p>}
                                                            <div className="flex gap-4 items-center my-2">
                                                                <img className="h-20 w-20 object-cover rounded-lg" src={image || 'https://semantic-ui.com/images/wireframe/image.png'} />
                                                                <div className="flex flex-col gap-1 justify-center">
                                                                    <Button type="button" disabled={fileLoading} variant='outline'>
                                                                        <label
                                                                            className="cursor-pointer"
                                                                            htmlFor="media"
                                                                        >
                                                                            Upload Event Image
                                                                            <input onChange={handleFileChange} accept="image/*" className="sr-only" id="media" name="media" type="file" />
                                                                        </label>
                                                                    </Button>
                                                                    <Button disabled={!image} onClick={() => setImage(undefined)} variant='outline' >Remove Upload</Button>
                                                                </div>
                                                            </div>
                                                            <input type="hidden" value={event.club._id} {...registerEdit('club')} />
                                                            <input type="hidden" value={event._id} {...registerEdit('_id')} />
                                                            <Button disabled={editIsPending} type="submit" className="w-full">
                                                                {editIsPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                Edit Event
                                                            </Button>
                                                        </form>
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                        <Dialog>
                                            <DialogTrigger>
                                                <Button size='icon' className="bg-red-500 text-white border-opacity-80 border-white text-xs w-6 h-6 border-2"><FaTrash /></Button>
                                            </DialogTrigger>
                                            <DialogContent className="">
                                                <DialogHeader>
                                                    <DialogTitle className="leading-normal">Are you sure you want to delete this event?</DialogTitle>
                                                    <DialogDescription>
                                                        <form onSubmit={handleSubmitDelete(onSubmitDelete)} className="w-full flex flex-col gap-y-2 mt-2">
                                                            <input type="hidden" value={event.club._id} {...registerDelete('club')} />
                                                            <input type="hidden" value={event._id} {...registerDelete('_id')} />
                                                            <Button variant='destructive' disabled={deleteIsPending} type="submit" className="w-full mt-5">
                                                                {deleteIsPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                Delete Event: {event.name}
                                                            </Button>
                                                        </form>
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
            }

        </Wrapper >
    )
}

export default EventsDashboard

