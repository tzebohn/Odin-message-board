import { useState } from 'react';
import './App.css'
import { IoIosAdd } from "react-icons/io";
import MessageForm from './components/MessageForm';

function App() {

  const [showForm, setShowForm] = useState(false)

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
  function handleSubmit (messageFormData) {
    console.log("Submitting form to backend")
  }

  return (
    <main className='h-screen flex items-center justify-center bg-[#0F172A]'>
      <section className='relative flex flex-col border rounded-xl bg-[#1E293B] p-4 w-full max-w-[90%] sm:max-w-[500px] md:max-w-[600px] h-[700px]'>
        
        <h1 className='text-xl md:text-2xl text-center text-[#818CF8] font-bold font-mono'>Mini Message Board</h1>
        <div className='border-t border-gray-600 my-2'></div>

        <div className='flex-1 flex flex-col gap-2 min-h-0'>
          <div className='flex-1 p-2 overflow-y-auto'>
            
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
