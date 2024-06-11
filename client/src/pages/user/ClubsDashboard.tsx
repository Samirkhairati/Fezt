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
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MdEdit } from "react-icons/md";

interface CreateClub {
    name: string,
}
interface EditClub {
    name: string,
    _id: string,
}
interface DeleteClub {
    _id: string,
}

function ClubsDashboard() {

    const { register, handleSubmit, reset, formState: { errors } } = useForm<EditClub>();
    const queryClient = useQueryClient();
    const userId = useStore(state => state.user?._id);

    const createClub = async (data: CreateClub) => {
        const response = await axios.post('/api/clubs', { ...data, userId });
        return response.data;
    };

    const readClubs = async () => {
        const response = await axios.get('/api/clubs', { params: { userId } });
        return response.data;
    }

    const editClub = async (data: CreateClub) => {
        const response = await axios.put('/api/clubs', { ...data });
        return response.data;
    };

    const deleteClub = async (data: DeleteClub) => {
        const response = await axios.delete('/api/clubs', { params: { ...data } });
        return response.data;
    };

    const { data: clubs, isLoading: readIsLoading } = useQuery({
        queryKey: ['clubs'],
        queryFn: readClubs,
        enabled: !!userId
    });

    const { mutate: createClubMutation, isPending: createIsPending } = useMutation({
        mutationFn: createClub,
        onSuccess: () => {
            toast.success("Club created successfully.");
            queryClient.invalidateQueries({ queryKey: ['clubs'] });
            reset();
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
        }
    });
    const { mutate: editClubMutation, isPending: editIsPending } = useMutation({
        mutationFn: editClub,
        onSuccess: () => {
            toast.success("Club edited successfully.");
            queryClient.invalidateQueries({ queryKey: ['clubs'] });
            reset();
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
        }
    });
    const { mutate: deleteClubMutation, isPending: deleteIsPending } = useMutation({
        mutationFn: deleteClub,
        onSuccess: () => {
            toast.success("Club deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ['clubs'] });
            reset();
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
        }
    });

    const onSubmitCreate = (data: CreateClub) => {
        createClubMutation(data);
    };
    const onSubmitEdit = (data: EditClub) => {
        editClubMutation(data);
    };
    const onSubmitDelete = (data: DeleteClub) => {
        deleteClubMutation(data);
    };

    return (
        <Wrapper redirect="/user/dashboard" title="CLUBS">
            <Dialog>
                <DialogTrigger>
                    <Button className="w-full bg-white text-black hover:bg-slate-200"><FaPlus className="mr-3" />New Club</Button>
                </DialogTrigger>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>Create a New Club</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={handleSubmit(onSubmitCreate)} className="w-full flex flex-col gap-y-2 mt-2">
                                <Input
                                    placeholder="Club Name"
                                    className="w-full"
                                    {...register("name", { required: true })}
                                />
                                {errors.name && <p className="text-red-500">Club Name is required</p>}
                                <Button disabled={createIsPending} type="submit" className="w-full">
                                    {createIsPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create new club
                                </Button>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            {readIsLoading ? <Loader2 className="w-full text-white text-center" /> :
                clubs?.length === 0 ? <p className="text-white text-center">No clubs created yet</p> :
                    <div className="bg-white w-full pt-4 pb-2 rounded-xl">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">Club</TableHead>
                                    <TableHead className="text-center">Revenue</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clubs?.map((club: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium text-center">{club.name}</TableCell>
                                        <TableCell className="text-center">₹{club.revenue}</TableCell>
                                        <TableCell className="text-center">
                                            <Dialog>
                                                <DialogTrigger>
                                                    <Button size='icon' className="bg-blue-500 text-white mr-2"><MdEdit /></Button>
                                                </DialogTrigger>
                                                <DialogContent className="">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Club</DialogTitle>
                                                        <DialogDescription>
                                                            <form onSubmit={handleSubmit(onSubmitEdit)} className="w-full flex flex-col gap-y-2 mt-2">
                                                                <input type="hidden" value={club._id} {...register('_id')} />
                                                                <Input
                                                                    placeholder="Club Name"
                                                                    className="w-full"
                                                                    {...register("name", { required: true })}
                                                                />
                                                                {errors.name && <p className="text-red-500">Club Name is required</p>}
                                                                <Button disabled={editIsPending} type="submit" className="w-full">
                                                                    {editIsPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                    Edit Club
                                                                </Button>
                                                            </form>
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>
                                            <Dialog>
                                                <DialogTrigger>
                                                    <Button size='icon' className="bg-red-500 text-white"><FaTrash /></Button>
                                                </DialogTrigger>
                                                <DialogContent className="">
                                                    <DialogHeader>
                                                        <DialogTitle className="leading-normal">Are you sure you want to delete this club?</DialogTitle>
                                                        <DialogDescription>
                                                            <form onSubmit={handleSubmit(onSubmitDelete)} className="w-full flex flex-col gap-y-2 mt-2">
                                                                <input type="hidden" value={club._id} {...register('_id')} />
                                                                <Button variant='destructive' disabled={deleteIsPending} type="submit" className="w-full">
                                                                    {deleteIsPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                    Delete Club
                                                                </Button>
                                                            </form>
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell className="text-center">Total</TableCell>
                                    <TableCell className="text-center">₹{clubs?.reduce((total: number, club: any) => total + club.revenue, 0)}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
            }

        </Wrapper>
    )
}

export default ClubsDashboard

