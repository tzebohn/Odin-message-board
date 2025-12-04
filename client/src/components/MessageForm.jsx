import { useState } from "react";

export default function MessageForm ({ onClose, onSubmit }) {
    const [username, setUsername] = useState("")
    const [message, setMessage] = useState("")
    const [errors, setErrors] = useState({
        user: false,
        message: false
    })
    
    /**
     * Handles the form submission:
     * - Prevents default page reload
     * - Ensures that username and message fields are not empty
     * - Updates error state
     * - Submits form if all fields are valid
     * @param {React.FormEvent} e 
     */
    function handleSubmit (e) {
        e.preventDefault()

        //  Simple client-side validation
        const newErrors = {
            user: username.trim() === "",
            message: message.trim() === ""
        }

        setErrors(newErrors)

        //  Submit valid form
        if (!newErrors.user && !newErrors.message) {
            onSubmit({ username, message }) // Send to parent component
            onClose()   // Unmount MessageForm
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-[#1E293B] p-4 rounded-xl w-[90%] sm:w-[400px]">
                <h2 className="text-lg text-[#818CF8] font-bold mb-3">New Message</h2>

                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        className={`p-2 rounded bg-[#334155] text-white outline-none focus:ring-2 focus:ring-blue-500 ${errors.user && "border-2 border-red-500 focus:border-transparent"}`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <textarea
                        placeholder="Your message..."
                        className={`p-2 rounded bg-[#334155] text-white h-24 resize-none outline-none focus:ring-2 focus:ring-blue-500 ${errors.message && "border-2 border-red-500 focus:border-transparent"}`}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            className="px-3 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white cursor-pointer"
                            onClick={onClose}
                        >
                        Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-3 py-1 rounded bg-[#818CF8] hover:bg-[#4FC3F7] text-white cursor-pointer"
                        >
                        Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}