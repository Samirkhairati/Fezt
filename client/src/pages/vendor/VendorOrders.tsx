/* eslint-disable @typescript-eslint/no-explicit-any */
import Wrapper from "@/components/Wrapper"

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
import axios from "axios";
import useStore from "@/actions/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { IItem } from '../../../../server/models/item.model';
import { IVendor } from "../../../../server/models/vendor.model";
import { IUser } from "../../../../server/models/user.model";
import Stepper from "@/components/Stepper";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaThumbsUp, FaCheck, FaBoxOpen } from "react-icons/fa";
import toast from "react-hot-toast";

interface Order {
    _id: string;
    user: IUser,
    vendor: IVendor,
    items: { _id: IItem, quantity: number }[],
    stage: number,
    createdAt: string
}

function VendorOrders() {

    const queryClient = useQueryClient();
    const vendorId = useStore(state => state.vendor?._id);

    const readOrdersByVendor = async () => {
        const response = await axios.get('/api/orders/vendor', { params: { vendorId } });
        return response.data;
    }
    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders', vendorId],
        queryFn: readOrdersByVendor,
        enabled: !!vendorId
    });

    const updateOrder = async (data: {stage: number, orderId: string}) => {
        const response = await axios.put('/api/orders', { ...data, vendorId});
        return response.data;
    };
    const { mutate: updateOrderMutation } = useMutation({
        mutationFn: updateOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders', vendorId] });
            toast.success('Order updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
        }
    });

    return (
        <Wrapper redirect={`/vendor/home`} title="ORDERS">
            {!isLoading && !orders?.length && <div className="text-center text-gray-500 mt-16">No orders found</div>}
            {isLoading ? <Loader2 className="w-full text-white text-center" /> :

                orders?.map((order: Order) => (
                    <>
                        <div className="!bg-[#dad6ba] px-2 ticket w-full max-w-[350px] mt-16">
                            <Table>
                                <TableCaption className="text-center mt-0 text-[#827769]">
                                    ----------------------------------------------
                                    <br /><br />
                                    <Stepper stage={order.stage} />
                                    <p className=" text-xs md:text-base mt-2 font-bold text-black leading-tight flex items-center justify-center grayscale opacity-25 gap-1">
                                        <Avatar className="w-5 h-5 border-[1px] p-[2px] bg-white border-gray-50 ">
                                            <img src={order.vendor.image} alt="User Avatar" />
                                        </Avatar>
                                        {order.vendor.name}
                                    </p>
                                    <p className="text-[10px] leading-tight opacity-65 mb-1">ID: {order._id} ({order.createdAt.slice(0, 10)}) <br /></p>
                                    <p className="text-[8px] leading-tight opacity-65 mb-1">{order.user.name} | {order.user.phone} | {order.user.address} | {order.user.bits} <br /></p>

                                </TableCaption>
                                <TableHeader className="">
                                    <TableRow>
                                        <TableHead className="text-center text-[#6b5f50]">QTY</TableHead>
                                        <TableHead className="text-[#6b5f50]">ITEM</TableHead>
                                        <TableHead className="text-right text-[#6b5f50]">AMT</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order?.items?.map((thing) => (
                                        <TableRow className="" key={thing._id._id}>
                                            <TableCell className="text-center text-[#403b34]">{thing.quantity}</TableCell>
                                            <TableCell className="text-[#403b34]">{thing._id.name}</TableCell>
                                            <TableCell className="text-right text-[#403b34]">₹{thing._id.price! * thing.quantity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter className="bg-[#dad6ba] py-1">
                                    <TableRow className="bg-[#dad6ba]">
                                        <TableCell className="text-center text-xs text-[#403b34]" colSpan={2}>TOTAL</TableCell>
                                        <TableCell className="text-right text-xs text-[#403b34]">₹{order.items?.reduce((total, item) => total + (item._id.price! * item.quantity), 0)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                        <div className="w-full flex justify-center gap-2 mt-5">
                            <Button onClick={() => updateOrderMutation({ stage: 2, orderId: order._id })} disabled={order.stage !== 1} className="text-sm bg-amber-700"><FaCheck /></Button>
                            <Button onClick={() => updateOrderMutation({ stage: 3, orderId: order._id })} disabled={order.stage !== 2} className="text-sm bg-amber-700"><FaThumbsUp /></Button>
                            <Button onClick={() => updateOrderMutation({ stage: 4, orderId: order._id })} disabled={order.stage !== 3} className="text-sm bg-amber-700"><FaBoxOpen /></Button>
                        </div>
                    </>
                ))
            }
        </Wrapper >
    )
}

export default VendorOrders

