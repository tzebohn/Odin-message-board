export default function MessageBubble ({ msg }) {

    return (
        <div className="flex flex-col gap-1 p-2">
            <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400">{msg.username}</span>
                <span className="w-full text-xs font-semibold text-gray-400">{new Date(msg.createdAt).toString()}</span>
            </div>
            <div className="">
                <p className="inline-block bg-[#818CF8] text-white font-semibold text-sm whitespace-pre-line rounded-2xl p-2 py-1">{msg.message}</p>
            </div>
        </div>
    )
}