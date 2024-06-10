import { FaDollarSign, FaThumbsUp, FaCheck, FaBoxOpen } from "react-icons/fa";

function Stepper({ stage = 1 }: { stage: number }) {
    return (
        <div className="flex gap-2 justify-center pl-4 mb-2">
            <div className={`flex flex-col items-start justify-center gap-1 ${stage < 1 && 'opacity-60'}`}>
                <div className="flex items-center gap-2">
                    <div className={`p-1 border border-[#827769] rounded-full  ${stage > 0 && 'bg-[#827769] text-[#dad6ba]'}`}>
                        <FaDollarSign className="text-[10px] " />
                    </div>
                    <div className="w-8 h-[1px] bg-[#827769]"></div>
                </div>
                <p className="text-[8px] -ml-[10px]">ORDERED</p>
            </div>
            <div className={`flex flex-col items-start justify-center gap-1 ${stage < 2 && 'opacity-60'}`}>
                <div className="flex items-center gap-2">
                    <div className={`p-1 border border-[#827769] rounded-full ${stage > 1 && 'bg-[#827769] text-[#dad6ba]'} `}>
                        <FaThumbsUp className="text-[10px] " />
                    </div>
                    <div className="w-8 h-[1px] bg-[#827769]"></div>
                </div>
                <p className="text-[8px] -ml-[12px]">ACCEPTED</p>
            </div>
            <div className={`flex flex-col items-start justify-center gap-1 ${stage < 3 && 'opacity-60'}`}>
                <div className="flex items-center gap-2">
                    <div className={`p-1 border border-[#827769] rounded-full ${stage > 2 && 'bg-[#827769] text-[#dad6ba]'} `}>
                        <FaCheck className="text-[10px] " />
                    </div>
                    <div className="w-8 h-[1px] bg-[#827769]"></div>
                </div>
                <p className="text-[8px] -ml-[3px]">READY</p>
            </div>
            <div className={`flex flex-col items-start justify-center gap-1 ${stage < 4 && 'opacity-60'}`}>
                <div className="flex items-center gap-2">
                    <div className={`p-1 border border-[#827769] rounded-full ${stage > 3 && 'bg-[#827769] text-[#dad6ba]'} `}>
                        <FaBoxOpen className="text-[10px] " />
                    </div>
                </div>
                <p className="text-[8px] -ml-3">DELIVERED</p>
            </div>
        </div>
    )
}

export default Stepper