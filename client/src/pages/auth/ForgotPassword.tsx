/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RiLockPasswordFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import useStore from "@/actions/store";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"
import { useState } from "react";

interface ResetForm {
  email: string,
  password: string,
  code: number,
  codeId: string
}

function ForgotPassword() {

  const navigate = useNavigate();
  const setVendor = useStore(state => state.setVendor);
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();
  const { register: registerReset, handleSubmit: handleSubmitReset, formState: { errors: errorsReset } } = useForm<ResetForm>();
  const [code, setCode] = useState<string>('')
  const [mail, setMail] = useState<string>('')

  //TODO: Add Vendor Login form validation 

  const forgotPassword = async (data: { email: string }) => {
    setMail(data.email)
    const response = await axios.post('/api/vendors/forgot', data);
    return response.data;
  };
  const resetPassword = async (data: ResetForm) => {
    const response = await axios.post('/api/vendors/reset', data);
    return response.data;
  };

  const { mutate: forgotPasswordMutation, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      setCode(data.codeId)
      toast.success("Verification code sent to your email");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    }
  });
  const { mutate: resetPasswordMutation, isPending: isResetting } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success("Vendor created successfully.");
      setVendor(data);
      localStorage.setItem('vendor', JSON.stringify(data));
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    }
  });

  const onSubmit = (data: { email: string }) => {
    forgotPasswordMutation(data);
  };
  const onSubmitReset = (data: ResetForm) => {
    resetPasswordMutation(data);
  };

  return (
    <div className="relative flex min-h-screen pb-10 w-full items-center justify-center bg-[url('/splash.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      <div className="flex flex-col items-center gap-8 relative z-10">
        <div className="flex flex-col items-center gap-8 relative z-10 w-full max-w-md px-4">
          <div className="flex items-center gap-2 mt-8 opacity-85">
            <RiLockPasswordFill className="h-8 w-8 text-gray-50" />
            <span className="text-4xl font-black text-gray-50">FORGOT PASSWORD</span>
          </div>
          {code === '' ?
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
              <p className="text-white">Remembered your password? <Link to="/login/vendor" className="text-violet-400">Login</Link></p>
              <Button disabled={isPending} type="submit" className="bg-violet-700 w-full">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Next
              </Button>
            </form>
            :
            <form onSubmit={handleSubmitReset(onSubmitReset)} className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-gray-50">
                  Verification Code
                </Label>
                <Input
                  id="code"
                  type="number"
                  placeholder="000000"
                  className="w-full"
                  {...registerReset("code", { required: true })}
                />
                {errorsReset.email && <p className="text-red-500">Email is required</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-50">
                  New Password
                </Label>
                <Input
                  id="password"
                  placeholder="**********"
                  className="w-full"
                  type="password"
                  {...registerReset("password", { required: true })}
                />
                {errorsReset.password && <p className="text-red-500">Password is required</p>}
              </div>
              <input type="hidden" value={code} {...registerReset('codeId')} />
              <input type="hidden" value={mail} {...registerReset('email')} />
              <Button disabled={isResetting} type="submit" className="bg-violet-700 w-full">
                {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Set new Password
              </Button>
            </form>
          }
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword