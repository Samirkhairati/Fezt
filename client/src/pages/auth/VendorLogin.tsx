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
import { Link } from "react-router-dom";

interface CreateUser {
    name: string,
    email: string,
    image: string,
    phone: string,
    address: string,
    bits: string
}

interface GoogleUser {
    email: string,
    photoURL: string
}

function VendorLogin() {

    const navigate = useNavigate();
    const setUser = useStore(state => state.setUser);
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm<CreateUser>();
    const [google, setGoogle] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<GoogleUser>({ email: '', photoURL: '' });

    //TODO: Add form validation 

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(firebase);
            const result = await signInWithPopup(auth, provider);
            setUserInfo({ email: result.user.email!, photoURL: result.user.photoURL! });
            axios.post('/api/users/login', {
                email: result.user.email
            }).then((response) => {
                if (response.data) {
                    toast.success("Logging in...");
                    setUser(response.data);
                    navigate('/');
                } else {
                    toast.success("Please fill out the form below to create an account.")
                    setGoogle(true);
                }
            }).catch((error) => {
                console.log("Could not create user: ", error);
            });
        } catch (error) {
            console.log("Could not sign in with Google: ", error);
        }
    }

    const createUser = async (data: CreateUser) => {
        const response = await axios.post('/api/users', { ...data, email: userInfo.email, image: userInfo.photoURL });
        console.log("User created: ", response.data);
        toast.success("User created successfully.");
        setUser(response.data);
        navigate('/');
        return response.data;
    };

    const { mutateAsync: createUserMutation } = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => {
            console.log("Error creating user: ", error);
        }
    });

    const onSubmit = (data: CreateUser) => {
        createUserMutation(data);
    };

    return (
        <div className="relative flex h-screen w-full items-center justify-center">
            <div className="absolute inset-0 bg-[url('/splash.png')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            <div className="flex flex-col items-center gap-8 relative z-10">
                <div className="flex flex-col items-center gap-8 relative z-10 w-full max-w-md px-4">
                    <div className="flex items-center gap-2 mt-8">
                        <FaRegUserCircle className="h-8 w-8 text-gray-50" />
                        <span className="text-4xl font-bold text-gray-50">Vendor Login</span>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                        <FaGoogle className="mr-2 h-4 w-4" />
                        Login with Google
                    </Button>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="e" className="text-gray-50">
                                Email
                            </Label>
                            <Input
                                disabled={!google}
                                id="email"
                                placeholder="vendor@example.com"
                                className="w-full"
                                {...register("email", { required: true })}
                            />
                            {errors.email && <p className="text-red-500">Email is required</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-50">
                                Password
                            </Label>
                            <Input
                                disabled={!google}
                                id="password"
                                placeholder="**********"
                                className="w-full"
                                type="password"
                                {...register("password", { required: true })}
                            />
                            {errors.phone && <p className="text-red-500">Password is required</p>}
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
                        <p className="text-white">Don't have an account? <Link to="/register" className="text-bold text-violet-400">Sign up</Link></p>
                        <Button type="submit" className="bg-violet-700 w-full">
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default VendorLogin