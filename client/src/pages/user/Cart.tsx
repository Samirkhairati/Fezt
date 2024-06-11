/* eslint-disable @typescript-eslint/no-explicit-any */
import useStore from "@/actions/store";
import Wrapper from "@/components/Wrapper"
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";


function Cart() {

    const navigate = useNavigate();
    const { vendorId } = useParams();
    const cart = useStore(state => state.cart);
    const setCart = useStore(state => state.setCart);
    const userId = useStore(state => state.user?._id);
    const items = cart?.map(item => ({ _id: item._id, quantity: item.quantity }));
    const queryClient = useQueryClient();

    const placeOrder = async () => {
        const response = await axios.post('/api/orders', { vendor: vendorId, user: userId, items });
        return response.data;
    };
    const { mutate: placeOrderMutation, isPending } = useMutation({
        mutationFn: placeOrder,
        onSuccess: (data) => {
            toast.success(data.message);
            setCart([]);
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            navigate('/user/home')
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
        }
    });


    useEffect(() => {
        (cart[0]?.vendorId !== vendorId) && setCart([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vendorId])

    return (
        <Wrapper redirect={`/user/shop/${vendorId}`} title="CART">
            <Dialog>
                <DialogTrigger>
                    <Button className="bg-blue-500 text-white mr-2">Place Order</Button>
                </DialogTrigger>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle className="leading-normal">Are you sure you want to place this order? It will cost you ₹{cart?.reduce((total, item) => total + (item.itemPrice * item.quantity), 0)}</DialogTitle>
                        <DialogDescription>
                            <Button disabled={isPending} onClick={() => placeOrderMutation()} className="mt-5 w-full">
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Place Order
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <div className="bg-gray-200 py-6 px-2 spikes w-full max-w-[350px] mt-14">
                <Table>
                    <TableCaption className="text-center mt-0 text">
                        ----------------------------------------------
                        <br /><br />
                        *** Thank you ***
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">QTY</TableHead>
                            <TableHead>ITEM</TableHead>
                            <TableHead className="text-right">AMT</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cart?.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="">{item.itemName}</TableCell>
                                <TableCell className="text-right">₹{item.itemPrice * item.quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter className="bg-gray-200 py-1">
                        <TableRow>
                            <TableCell className="text-center text-xs text-gray-500" colSpan={2}>TOTAL</TableCell>
                            <TableCell className="text-right text-xs text-gray-500">₹{cart?.reduce((total, item) => total + (item.itemPrice * item.quantity), 0)}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </Wrapper>
    )
}

export default Cart

