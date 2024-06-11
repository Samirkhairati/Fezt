/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FaRegUserCircle } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import firebase from '../../lib/firebase'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useStore from "@/actions/store";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface CreateUser {
    name: string,
    email: string,
    image: string,
    phone: string,
    address: string,
    bits: string,
    codeId: string,
    code: number
}

interface GoogleUser {
    email: string,
    photoURL: string
}

function UserLogin() {
    const navigate = useNavigate();
    const setUser = useStore(state => state.setUser);
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors, isLoading } } = useForm<CreateUser>();
    const [google, setGoogle] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<GoogleUser>({ email: '', photoURL: '' });
    const [code, setCode] = useState<string>('');

    //TODO: Add User Login form validation
    //TODO: Add BITS mail check

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(firebase);
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();
            const uid = result.user.uid
            setUserInfo({ email: result.user.email!, photoURL: result.user.photoURL! });
            axios.post('/api/users/login', {
                email: result.user.email,
                token: token,
                uid: uid
            }).then((response) => {
                if (!response.data.codeId) {
                    toast.success("Logging in...");
                    setUser(response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                    navigate('/');
                } else {
                    setCode(response.data.codeId)
                    toast.success("Fill these details to create an account. Verification code has been sent to your mail.")
                    setGoogle(true);
                }
            }).catch((error) => {
                toast.error(error.response.data.message);
            });
        } catch (error) {
            console.log(error);
        }
    }

    const createUser = async (data: CreateUser) => {
        const response = await axios.post('/api/users', { ...data, email: userInfo.email, image: userInfo.photoURL });
        return response.data;
    };

    const { mutate: createUserMutation } = useMutation({
        mutationFn: createUser,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success("User created successfully.");
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/');
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
        }
    });

    const onSubmit = (data: CreateUser) => {
        createUserMutation(data);
    };

    return (
        <div className="relative flex min-h-screen pb-10 w-full items-center justify-center bg-[url('/splash.png')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            <div className="flex flex-col items-center gap-8 relative z-10">
                <div className="flex flex-col items-center gap-8 relative z-10 w-full max-w-md px-4">
                    <div className="flex items-center gap-2 mt-8">
                        <FaRegUserCircle className="h-8 w-8 text-gray-50" />
                        <span className="text-4xl font-bold text-gray-50">Student Login</span>
                    </div>
                    <Button disabled={!!google} variant="outline" className="w-full" onClick={handleGoogleLogin}>
                        <FaGoogle className="mr-2 h-4 w-4" />
                        Login with Google
                    </Button>
                    {google && <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-50">
                                Name
                            </Label>
                            <Input
                                disabled={!google}
                                id="name"
                                placeholder="John Doe"
                                className="w-full"
                                {...register("name", { required: true })}
                            />
                            {errors.name && <p className="text-red-500">Name is required</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-50">
                                Phone Number
                            </Label>
                            <Input
                                disabled={!google}
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
                                disabled={!google}
                                id="address"
                                placeholder="XXX, Valmiki Bhavan"
                                className="w-full"
                                {...register("address", { required: true })}
                            />
                            {errors.address && <p className="text-red-500">Address is required</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="id" className="text-gray-50">
                                BITS ID
                            </Label>
                            <Input
                                disabled={!google}
                                id="id"
                                placeholder="2023AXPSXXXXH"
                                className="w-full"
                                {...register("bits", { required: true })}
                            />
                            {errors.bits && <p className="text-red-500">BITS ID is required</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code" className="text-gray-50">
                                Verification Code
                            </Label>
                            <Input
                                type="number"
                                disabled={!google}
                                id="code"
                                placeholder="000000"
                                className="w-full"
                                {...register("code", { required: true })}
                            />
                            {errors.phone && <p className="text-red-500">Phone number is required</p>}
                        </div>
                        <input type="hidden" value={code} {...register('codeId')} />
                        <Button disabled={isLoading} type="submit" className="bg-slate-700 w-full">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Login as Student
                        </Button>
                    </form>}
                </div>
            </div>
        </div>
    )
}

export default UserLogin