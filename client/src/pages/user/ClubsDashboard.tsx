import { FaPlus } from "react-icons/fa";
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

function ClubsDashboard() {

    

    //TODO: custom props
    return (
        <Wrapper redirect="/user/home/dashboard" title="CLUBS">
            <Dialog>
                <DialogTrigger>
                    <Button className="w-full bg-white text-black hover:bg-slate-200"><FaPlus className="mr-3" />New Club</Button>
                </DialogTrigger>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>Create a New Club</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                                <Input
                                    placeholder="Club Name"
                                    className="w-full"
                                    {...register("club", { required: true })}
                                />
                                {errors.club && <p className="text-red-500">Club Name is required</p>}
                                <Button disabled={isPending} type="submit" className="w-full">
                                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Login as Vendor
                                </Button>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </Wrapper>
    )
}

export default ClubsDashboard

