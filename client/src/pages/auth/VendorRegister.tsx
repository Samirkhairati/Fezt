/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { MdSell } from "react-icons/md";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useStore from "@/actions/store";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react"

interface CreateVendor {
    name: string,
    email: string,
    image: string,
    phone: string,
    address: string,
    password: string
}

function VendorRegister() {
    const navigate = useNavigate();
    const setVendor = useStore(state => state.setVendor);
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm<CreateVendor>();
    const [imageSrc, setImageSrc] = useState<string>('https://filetandvine.com/wp-content/uploads/2015/11/buddy-placeholder-square.jpg?w=640');
    const [fileLoading, setFileLoading] = useState<boolean>(false);

    //TODO: Add Vendor Register form validation
    //TODO: Add Forgot Password
    //TODO: Add Verification Email
    //TODO: upload size limit

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const data = new FormData();
        data.append('file', e.target.files![0]);
        data.append('upload_preset', 'preset');

        try {
            setFileLoading(true)
            const file = await axios.post('https://api.cloudinary.com/v1_1/dkytadhg9/auto/upload', data)
            setImageSrc(file.data.secure_url);
        } catch (error) {
            toast.error("Couldn't upload image")
        } finally {
            setFileLoading(false)
        }

    }

    const createVendor = async (data: CreateVendor) => {
        toast.success("Creating Vendor...")
        const response = await axios.post('/api/vendors', { ...data, image: imageSrc });
        return response.data;
    };

    const { mutate: createVendorMutation, isPending } = useMutation({
        mutationFn: createVendor,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['vendors'] });
            toast.success("Vendor created successfully.");
            setVendor(data);
            navigate('/');
        },
        onError: (error: any) => {
            toast.error(error.response.data.message)
        }
    });

    const onSubmit = (data: CreateVendor) => {
        createVendorMutation(data);
    };

    return (
        <div className="relative flex min-h-screen pb-10 w-full items-center justify-center bg-[url('/splash.png')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            <div className="flex flex-col items-center gap-8 relative z-10">
                <div className="flex flex-col items-center gap-8 relative z-10 w-full max-w-md px-4">
                    <div className="flex items-center gap-2 mt-8">
                        <MdSell className="h-8 w-8 text-gray-50" />
                        <span className="text-4xl font-bold text-gray-50">Vendor Sign Up</span>
                    </div>
                    <Avatar className="w-28 h-28 border-2 border-gray-50">
                        <img src={imageSrc} alt="User Avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button disabled={fileLoading} className="bg-violet-700">
                        <label
                            className="cursor-pointer"
                            htmlFor="media"
                        >
                            Upload Brand Logo
                            <input onChange={handleFileChange} accept="image/*" className="sr-only" id="media" name="media" type="file" />
                        </label>
                    </Button>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-50">
                                Brand Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="Brand Name"
                                className="w-full"
                                {...register("name", { required: true })}
                            />
                            {errors.name && <p className="text-red-500">Name is required</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-50">
                                Email
                            </Label>
                            <Input
                                id="email"
                                placeholder="vendor@example.com"
                                className="w-full"
                                {...register("email", { required: true })}
                            />
                            {errors.email && <p className="text-red-500">Email is required</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-50">
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                placeholder="9876543210"
                                className="w-full"
                                {...register("phone", { required: true })}
                            />
                            {errors.phone && <p className="text-red-500">Phone number is required</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-gray-50">
                                Address
                            </Label>
                            <Input
                                id="address"
                                placeholder="XXX, Shamirpet"
                                className="w-full"
                                {...register("address", { required: true })}
                            />
                            {errors.address && <p className="text-red-500">Address is required</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-50">
                                Password
                            </Label>
                            <Input
                                id="password"
                                placeholder="**********"
                                className="w-full"
                                type="password"
                                {...register("password", { required: true })}
                            />
                            {errors.password && <p className="text-red-500">Password is required</p>}
                        </div>
                        <p className="text-white">Already have an account? <Link to="/login/vendor" className="text-violet-400">Sign in</Link></p>
                        <Button disabled={isPending} type="submit" className="bg-violet-700 w-full">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create New  Vendor Account
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default VendorRegister