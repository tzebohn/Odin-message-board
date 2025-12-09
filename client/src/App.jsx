import { useState } from 'react';
import './App.css'
import { IoIosAdd } from "react-icons/io";
import MessageForm from './components/MessageForm';
import axios from 'axios';
import MessageBubble from './components/MessageBubble';

function App() {

  const [showForm, setShowForm] = useState(false)
  const [messages, setMessages] = useState([])

  /**
   * Sets setShowForm state to false.
   * Unmounts MessageForm component.
   */
  function closeForm () {
    setShowForm(false)
  }

  /**
   * Submits message form data to backend server.
   * @param {Object} messageFormData 
   */
  async function handleSubmit (messageFormData) {
    // Instantly display temp message on frontend for user
    const tempId = crypto.randomUUID()

    const tempMessage = {
      id: tempId,
      ...messageFormData,
      pending: true,
      createdAt: Date.now()
    }

    setMessages(prev => [...prev, tempMessage])

    // Send POST request to backend server
    try {
      const response = await axios.post("/api/posts/create-post", messageFormData)
      const savedMessage = response.data
      console.log(savedMessage)
      // Replace temp message with real one
      setMessages(prev => 
        prev.map(msg => msg.id === tempId ? savedMessage : msg) // Replaces tempId with database ID
      )

    } catch (err) {
      // Remove temp message on failure
      setMessages(prev => 
        prev.filter(msg => msg.id !== tempId)
      )
      console.error("Error submitting message:", err)
    }
  }

  return (
    <main className='h-screen flex items-center justify-center bg-[#0F172A]'>
      <section className='relative flex flex-col border rounded-xl bg-[#1E293B] p-4 w-full max-w-[90%] sm:max-w-[500px] md:max-w-[600px] h-[700px]'>
        
        <h1 className='text-xl md:text-2xl text-center text-[#818CF8] font-bold font-mono'>Mini Message Board</h1>
        <div className='border-t border-gray-600 my-2'></div>

        <div className='flex-1 flex flex-col gap-2 min-h-0'>
          <div className='flex-1 p-2 overflow-y-auto'>
            {messages.map(msg => (
              <MessageBubble 
                key={msg.id}
                msg={msg}
              />
            ))}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className='flex items-center justify-center gap-2 bg-[#818CF8] rounded-lg cursor-pointer hover:bg-[#4FC3F7] p-2'
          >
            <IoIosAdd className="text-xl text-white" />
            <span className='text-[#F8FAFC] font-semibold'>New Message</span>
          </button>
        </div>

        {showForm && <MessageForm onClose={closeForm} onSubmit={handleSubmit}/>}

      </section>
    </main>
  )
}

export default App
