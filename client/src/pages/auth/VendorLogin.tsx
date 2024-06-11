/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { MdSell } from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import useStore from "@/actions/store";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"

interface LoginVendor {
  email: string,
  password: string
}

function VendorLogin() {

  const navigate = useNavigate();
  const setVendor = useStore(state => state.setVendor);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginVendor>();

  //TODO: Add Vendor Login form validation 

  const loginVendor = async (data: LoginVendor) => {
    const response = await axios.post('/api/vendors/login', data);
    return response.data;
  };

  const { mutate: loginVendorMutation, isPending } = useMutation({
    mutationFn: loginVendor,
    onSuccess: (data) => {
      toast.success("Vendor logged in successfully.");
      setVendor(data);
      localStorage.setItem('vendor', JSON.stringify(data));
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    }
  });

  const onSubmit = (data: LoginVendor) => {
    loginVendorMutation(data);
  };

  return (
    <div className="relative flex min-h-screen pb-10 w-full items-center justify-center bg-[url('https://i.imgur.com/RrdPB20.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black" />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      <div className="flex flex-col items-center gap-8 relative z-10">
        <div className="flex flex-col items-center gap-8 relative z-10 w-full max-w-md px-4">
          <div className="flex items-center gap-2 mt-8 font-black text-gray-50 opacity-85">
            <MdSell className="h-8 w-8 text-gray-50" />
            <span className="text-4xl text-gray-50">VENDOR LOGIN</span>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
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
            <p className="text-white leading-none">Don't have an account? <Link to="/register" className="text-violet-400">Sign up</Link></p>
            <p className="text-white leading-none">Forgot your password? <Link to="/forgot" className="text-violet-400">Reset it</Link></p>
            <Button disabled={isPending} type="submit" className="bg-violet-700 w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login as Vendor
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VendorLogin