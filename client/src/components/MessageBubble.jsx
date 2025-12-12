import { RxAvatar } from "react-icons/rx";
import { MdError } from "react-icons/md";

export default function MessageBubble ({ msg }) {

    return (
        <>
            {msg.type === "error" ? (
                <div className="flex items-start gap-4 p-2">
                    <div className="relative bg-green-300 rounded-sm ">
                        <RxAvatar className="text-[#818CF8] text-2xl sm:text-3xl md:text-4xl"/>
                        <MdError className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-red-400 bg-white rounded-full md:text-xl"/>
                    </div>
                    <div className="p-2 md:py-4 rounded-md border border-red-500 w-full">
                        <p className="text-white">{msg.text}</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-1 p-2">
                    <div className="px-2 flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-400">{msg.username}</span>
                        <span className="w-full text-xs font-semibold text-gray-400">{new Date(msg.createdAt).toString()}</span>
                    </div>
                    <div className="">
                        <p className="inline-block bg-[#818CF8] text-white font-semibold text-sm sm:text-base whitespace-pre-line rounded-2xl p-2 py-1">{msg.message}</p>
                    </div>
                </div>
            )}
        </>
    )
}