/* eslint-disable @typescript-eslint/no-explicit-any */
import Wrapper from "@/components/Wrapper"
import axios from "axios";
import useStore from "@/actions/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { IItem } from '../../../../server/models/item.model';
import { IVendor } from "../../../../server/models/vendor.model";
import { IUser } from "../../../../server/models/user.model";
import { Button } from "@/components/ui/button";
import { FaThumbsUp, FaCheck, FaBoxOpen, FaDollarSign } from "react-icons/fa";
import toast from "react-hot-toast";
import OrderBill from "@/components/OrderBill";

interface Order {
    _id: string;
    user: IUser,
    vendor: IVendor,
    items: { _id: IItem, quantity: number }[],
    stage: number,
    createdAt: string
}

//TODO: separate completed and pending orders

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

    const updateOrder = async (data: { stage: number, orderId: string }) => {
        const response = await axios.put('/api/orders', { ...data, vendorId });
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

    const orders1 = orders?.filter((order: Order) => order.stage === 1);
    const orders2 = orders?.filter((order: Order) => order.stage === 2);
    const orders3 = orders?.filter((order: Order) => order.stage === 3);
    const orders4 = orders?.filter((order: Order) => order.stage === 4);

    return (
        <Wrapper redirect={`/vendor/home`} title="ORDERS">
            {!isLoading && !orders?.length && <div className="text-center text-gray-500 mt-16">No orders found</div>}
            {isLoading ? <Loader2 className="w-full text-white text-center" /> :
                <>
                    <div className="h-10 w-full opacity-0 -mt-32">.</div>
                    {orders1.length && <h2 className="text-center mt-5 -mb-10 text-xl text-white font-bold opacity-60 flex  items-center gap-1"><FaDollarSign className="text-sm" />ORDERED</h2>}
                    {orders1?.map((order: Order) => (
                        <>
                            <OrderBill key={order._id} order={order} />
                            <div className="w-full flex justify-center gap-2 mt-5">
                                <Button onClick={() => updateOrderMutation({ stage: 2, orderId: order._id })} disabled={order.stage !== 1} className="text-sm bg-amber-700"><FaCheck /></Button>
                                <Button onClick={() => updateOrderMutation({ stage: 3, orderId: order._id })} disabled={order.stage !== 2} className="text-sm bg-amber-700"><FaThumbsUp /></Button>
                                <Button onClick={() => updateOrderMutation({ stage: 4, orderId: order._id })} disabled={order.stage !== 3} className="text-sm bg-amber-700"><FaBoxOpen /></Button>
                            </div>
                        </>
                    ))}
                    {orders2.length && <h2 className="text-center mt-5 -mb-10 text-xl text-white font-bold opacity-60 flex  items-center gap-1"><FaThumbsUp className="text-sm" />ACCEPTED</h2>}
                    {orders2?.map((order: Order) => (
                        <>
                            <OrderBill key={order._id} order={order} />
                            <div className="w-full flex justify-center gap-2 mt-5">
                                <Button onClick={() => updateOrderMutation({ stage: 2, orderId: order._id })} disabled={order.stage !== 1} className="text-sm bg-amber-700"><FaCheck /></Button>
                                <Button onClick={() => updateOrderMutation({ stage: 3, orderId: order._id })} disabled={order.stage !== 2} className="text-sm bg-amber-700"><FaThumbsUp /></Button>
                                <Button onClick={() => updateOrderMutation({ stage: 4, orderId: order._id })} disabled={order.stage !== 3} className="text-sm bg-amber-700"><FaBoxOpen /></Button>
                            </div>
                        </>
                    ))}
                    {orders3.length && <h2 className="text-center mt-5 -mb-10 text-xl text-white font-bold opacity-60 flex  items-center gap-1"><FaCheck className="text-sm" />READY</h2>}
                    {orders3?.map((order: Order) => (
                        <>
                            <OrderBill key={order._id} order={order} />
                            <div className="w-full flex justify-center gap-2 mt-5">
                                <Button onClick={() => updateOrderMutation({ stage: 2, orderId: order._id })} disabled={order.stage !== 1} className="text-sm bg-amber-700"><FaCheck /></Button>
                                <Button onClick={() => updateOrderMutation({ stage: 3, orderId: order._id })} disabled={order.stage !== 2} className="text-sm bg-amber-700"><FaThumbsUp /></Button>
                                <Button onClick={() => updateOrderMutation({ stage: 4, orderId: order._id })} disabled={order.stage !== 3} className="text-sm bg-amber-700"><FaBoxOpen /></Button>
                            </div>
                        </>
                    ))}
                    {orders4.length && <h2 className="text-center mt-5 -mb-10 text-xl text-white font-bold opacity-60 flex  items-center gap-1"><FaBoxOpen className="text-sm" />DELIVERED</h2>}
                    {orders4?.map((order: Order) => (
                        <>
                            <OrderBill key={order._id} order={order} />
                            <div className="w-full flex justify-center gap-2 mt-5">
                                <Button onClick={() => updateOrderMutation({ stage: 2, orderId: order._id })} disabled={order.stage !== 1} className="text-sm bg-amber-700"><FaCheck /></Button>
                                <Button onClick={() => updateOrderMutation({ stage: 3, orderId: order._id })} disabled={order.stage !== 2} className="text-sm bg-amber-700"><FaThumbsUp /></Button>
                                <Button onClick={() => updateOrderMutation({ stage: 4, orderId: order._id })} disabled={order.stage !== 3} className="text-sm bg-amber-700"><FaBoxOpen /></Button>
                            </div>
                        </>
                    ))}
                </>
            }

            <div className="h-10 w-full opacity-0">.</div>
        </Wrapper >
    )
}

export default VendorOrders

