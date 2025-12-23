import { RxAvatar } from "react-icons/rx";
import { MdError } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im";

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
                        <span className="text-xs sm:text-base font-semibold text-[#818CF8]">{msg.username}</span>
                        <span className="w-full text-xs font-semibold text-gray-400">
                            {new Date(msg.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                    <div>
                        <p 
                            className={`relative inline-block text-white font-semibold 
                                        text-sm sm:text-base whitespace-pre-line break-all rounded-2xl 
                                        py-2 p-3 
                                        ${msg.pending 
                                            ? "pr-6 sm:pr-7 bg-gradient-to-br from-[#818CF8]/70 to-[#6366F1]/60 text-white/90 shadow-sm shadow-indigo-500/20 animate-pulse" 
                                            : "bg-gradient-to-br from-[#818CF8] to-[#6366F1] text-white shadow-md shadow-indigo-500/40"
                                        }
                                        ring-1 ring-white/20
                                        transition-all duration-200`}
                        >
                            <span>{msg.message}</span>
                            {msg.pending && <ImSpinner2 className="absolute bottom-2 right-2 animate-spin text-[10px] sm:text-[11px] text-white drop-shadow-[0_0_2px_white]"/>}
                        </p>
                    </div>
                </div>
            )}
        </> 
    )
}