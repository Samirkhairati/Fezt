/* eslint-disable @typescript-eslint/no-explicit-any */
import Wrapper from "@/components/Wrapper"
import axios from "axios";
import useStore from "@/actions/store";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { IItem } from '../../../../server/models/item.model';
import { IVendor } from "../../../../server/models/vendor.model";
import { IUser } from "../../../../server/models/user.model";
import OrderBill from "@/components/OrderBill";
import { FaBoxOpen, FaCheck, FaDollarSign, FaThumbsUp } from "react-icons/fa";


interface Order {
    _id: string;
    user: IUser,
    vendor: IVendor,
    items: { _id: IItem, quantity: number }[],
    stage: number,
    createdAt: string
}

function Orders() {

    const userId = useStore(state => state.user?._id)
    const readOrdersByUser = async () => {
        const response = await axios.get('/api/orders/user', { params: { userId } });
        return response.data;
    }
    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: readOrdersByUser,
        enabled: !!userId
    });

    const orders1 = orders?.filter((order: Order) => order.stage === 1);
    const orders2 = orders?.filter((order: Order) => order.stage === 2);
    const orders3 = orders?.filter((order: Order) => order.stage === 3);
    const orders4 = orders?.filter((order: Order) => order.stage === 4);

    return (
        <Wrapper redirect={`/user/home`} title="ORDERS">
            {!isLoading && !orders?.length && <div className="text-center text-gray-500 mt-16">No orders found</div>}
            {isLoading ? <Loader2 className="w-full text-white text-center" /> :
                <>
                    <div className="h-10 w-full opacity-0 -mt-24">.</div>
                    {!!orders1.length && <h2 className="text-center mt-5 -mb-10 text-xl text-white font-bold opacity-60 flex  items-center gap-1"><FaDollarSign className="text-sm" />ORDERED</h2>}
                    {orders1?.map((order: Order) => (
                        <OrderBill key={order._id} order={order} />
                    ))}
                    {!!orders2.length && <h2 className="text-center mt-5 -mb-10 text-xl text-white font-bold opacity-60 flex  items-center gap-1"><FaThumbsUp className="text-sm" />ACCEPTED</h2>}
                    {orders2?.map((order: Order) => (
                        <OrderBill key={order._id} order={order} />
                    ))}
                    {!!orders3.length && <h2 className="text-center mt-5 -mb-10 text-xl text-white font-bold opacity-60 flex  items-center gap-1"><FaCheck className="text-sm" />READY</h2>}
                    {orders3?.map((order: Order) => (
                        <OrderBill key={order._id} order={order} />
                    ))}
                    {!!orders4.length && <h2 className="text-center mt-5 -mb-10 text-xl text-white font-bold opacity-60 flex  items-center gap-1"><FaBoxOpen className="text-sm" />DELIVERED</h2>}
                    {orders4?.map((order: Order) => (
                        <OrderBill key={order._id} order={order} />
                    ))}
                </>
            }

            <div className="h-10 w-full opacity-0">.</div>
        </Wrapper >
    )
}

export default Orders

