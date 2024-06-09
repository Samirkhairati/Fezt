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
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useStore from "@/actions/store";
import { MdEdit } from "react-icons/md";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";

//TODO: button colors

interface CreateItem {
    name: string,
    image: string,
    price: number,
    vendor: string,
    _id: string,
}
interface EditItem {
    name: string,
    image: string,
    price: number,
    _id: string,
    vendor: string,
}
interface DeleteItem {
    _id: string,
    vendor: string,
}
interface ItemSchema {
    _id: string,
    name: string,
    image?: string,
    price?: number
    vendor: {
        _id: string,
        name: string,
        image: string
    },
}

function Items() {

    const { register: registerCreate, handleSubmit: handleSubmitCreate, reset: resetCreate, formState: { errors: errorsCreate } } = useForm<CreateItem>();
    const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm<EditItem>();
    const { register: registerDelete, handleSubmit: handleSubmitDelete, reset: resetDelete } = useForm<DeleteItem>();
    const queryClient = useQueryClient();
    const vendorId = useStore(state => state.vendor?._id);
    const [fileLoading, setFileLoading] = useState(false);
    const [image, setImage] = useState<string | undefined>(undefined);

    const readItemsByVendor = async () => {
        const response = await axios.get('/api/items/vendor', { params: { vendorId } });
        console.log(response.data)
        return response.data;
    }

    const createItem = async (data: CreateItem) => {
        const response = await axios.post('/api/items', { ...data, image });
        return response.data;
    };

    const editItem = async (data: EditItem) => {
        const response = await axios.put('/api/items', { ...data, image });
        return response.data;
    };

    const deleteItem = async (data: DeleteItem) => {
        const response = await axios.delete('/api/items', { params: { ...data } });
        return response.data;
    };

    const { data: items, isLoading: readIsLoading } = useQuery({
        queryKey: ['items', vendorId],
        queryFn: readItemsByVendor,
        enabled: !!vendorId
    });

    const { mutate: createItemMutation, isPending: createIsPending } = useMutation({
        mutationFn: createItem,
        onSuccess: () => {
            toast.success("Item created successfully.");
            queryClient.invalidateQueries({ queryKey: ['items', vendorId] });
            setImage(undefined);
            resetCreate();
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
            resetCreate();
        }
    });
    const { mutate: editItemMutation, isPending: editIsPending } = useMutation({
        mutationFn: editItem,
        onSuccess: () => {
            toast.success("Item edited successfully.");
            queryClient.invalidateQueries({ queryKey: ['items', vendorId] });
            setImage(undefined);
            resetEdit();
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
            resetEdit();
        }
    });
    const { mutate: deleteItemMutation, isPending: deleteIsPending } = useMutation({
        mutationFn: deleteItem,
        onSuccess: () => {
            toast.success("Item deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ['items', vendorId] });
            resetDelete();
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
            resetDelete();
        }
    });

    const onSubmitCreate = (data: CreateItem) => {
        createItemMutation(data);
    };
    const onSubmitEdit = (data: EditItem) => {
        editItemMutation(data);
    };
    const onSubmitDelete = (data: DeleteItem) => {
        deleteItemMutation(data);
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
        <Wrapper redirect="/vendor/home" title="ITEMS">
            <Dialog>
                <DialogTrigger>
                    <Button className="w-full bg-white text-black hover:bg-slate-200"><FaPlus className="mr-3" />New Item</Button>
                </DialogTrigger>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>Create a New Item</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={handleSubmitCreate(onSubmitCreate)} className="w-full flex flex-col gap-y-2 mt-2">
                                <Input
                                    placeholder="Item Name"
                                    className="w-full"
                                    {...registerCreate("name", { required: true })}
                                />
                                {errorsCreate.name && <p className="text-red-500">Item Name is required</p>}
                                <Input
                                    placeholder="Price in Rs."
                                    className="w-full"
                                    type="number"
                                    {...registerCreate("price", { required: true, valueAsNumber: true, min: 0 })}
                                />
                                {errorsCreate.price && <p className="text-red-500">Price is required</p>}
                                <div className="flex gap-4 items-center my-2">
                                    <img className="h-20 w-20 object-cover rounded-lg" src={image || 'https://semantic-ui.com/images/wireframe/image.png'} />
                                    <div className="flex flex-col gap-1 justify-center">
                                        <Button type="button" disabled={fileLoading} variant='outline'>
                                            <label
                                                className="cursor-pointer"
                                                htmlFor="media"
                                            >
                                                Upload Item Image
                                                <input onChange={handleFileChange} accept="image/*" className="sr-only" id="media" name="media" type="file" />
                                            </label>
                                        </Button>
                                        <Button disabled={!image} onClick={() => setImage(undefined)} variant='outline' >Remove Upload</Button>
                                    </div>
                                </div>
                                <input type="hidden" value={vendorId} {...registerCreate('vendor')} />
                                <Button disabled={createIsPending || fileLoading} type="submit" className="w-full">
                                    {(createIsPending || fileLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create new Item
                                </Button>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            {readIsLoading ? <Loader2 className="w-full text-white text-center" /> :
                items?.length === 0 ? <p className="text-white text-center">No items created yet</p> :
                    items?.map((item: ItemSchema, index: number) => (
                        <div key={index} className="w-full h-[170px] md:h-[25%] flex flex-row gap-4">
                            <div className={`relative flex items-center justify-start w-[100%] md:hover:scale-105 transition-transform ease-in-out duration-300 h-full border-white border-4 bg-[url('/pattern4.png')] bg-cover bg-center`}>
                                <img className='h-full object-contain aspect-square border-white' src={item.image} />
                                <div className="py-3 px-7 flex flex-col justify-center h-full">
                                    <h2 className="text-xs md:text-xl font-extrabold uppercase leading-tight text-wrap text-black opacity-90">{item.name}</h2>
                                    <p className="text-xs md:text-base mt-1 font-bold text-black opacity-80 leading-tight flex items-center gap-1">
                                        <Avatar className="w-5 h-5 border-[1px] p-[2px] bg-white border-gray-50 ">
                                            <img src={item.vendor.image} alt="User Avatar" />
                                        </Avatar>
                                        {item.vendor.name}</p>
                                    <p className="text-xs md:text-xl font-extrabold text-black opacity-80 leading-tight">₹ {item.price || 'FREE'}</p>
                                    <div className="absolute right-2 bottom-2 flex-col flex gap-1">
                                        <Dialog>
                                            <DialogTrigger>
                                                <Button type="button" size='icon' className="bg-blue-500 text-white text-xs w-6 h-6 border-2 border-opacity-80 border-white"><MdEdit /></Button>
                                            </DialogTrigger>
                                            <DialogContent className="">
                                                <DialogHeader>
                                                    <DialogTitle>Edit Item</DialogTitle>
                                                    <DialogDescription>
                                                        <form onSubmit={handleSubmitEdit(onSubmitEdit)} className="w-full flex flex-col gap-y-2 mt-2">
                                                            <Input
                                                                placeholder="Item Name"
                                                                className="w-full"
                                                                {...registerEdit("name")}
                                                            />
                                                            <Input
                                                                placeholder="Price in Rs."
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
                                                                            Upload Item Image
                                                                            <input onChange={handleFileChange} accept="image/*" className="sr-only" id="media" name="media" type="file" />
                                                                        </label>
                                                                    </Button>
                                                                    <Button disabled={!image} onClick={() => setImage(undefined)} variant='outline' >Remove Upload</Button>
                                                                </div>
                                                            </div>
                                                            <input type="hidden" value={item._id} {...registerEdit('_id')} />
                                                            <input type="hidden" value={vendorId} {...registerEdit('vendor')} />
                                                            <Button disabled={editIsPending} type="submit" className="w-full">
                                                                {editIsPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                Edit Item
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
                                                    <DialogTitle>Are you sure you want to delete this item?</DialogTitle>
                                                    <DialogDescription>
                                                        <form onSubmit={handleSubmitDelete(onSubmitDelete)} className="w-full flex flex-col gap-y-2 mt-2">
                                                            <input type="hidden" value={vendorId} {...registerDelete('vendor')} />
                                                            <input type="hidden" value={item._id} {...registerDelete('_id')} />
                                                            <Button variant='destructive' disabled={deleteIsPending} type="submit" className="w-full mt-5">
                                                                {deleteIsPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                Delete Item: {item.name}
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

export default Items

