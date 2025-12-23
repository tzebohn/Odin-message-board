import { useCallback, useState } from 'react';
import './App.css'
import { IoIosAdd } from "react-icons/io";
import MessageForm from './components/MessageForm';
import axios from 'axios';
import MessageBubble from './components/MessageBubble';
import { useRef } from 'react';
import { useEffect } from 'react';
import { socket } from './socket.js';

function App() {

  const [showForm, setShowForm] = useState(false) // Dynamically displays MessageForm
  const [messages, setMessages] = useState([])    // Tracks all current messages
  const [hasMore, setHasMore] = useState(true)    // Tracks if there are more messages
  const [loading, setLoading] = useState(false)   // Tracks if currently fetching messages
  const [page, setPage] = useState(1)             // Tracks the current page

  const bottomRef = useRef(null)            // Points to the current bottom of the message container
  const hasMoreRef = useRef(true)           // Syncs with hasMore useState
  const loadingRef = useRef(false)          // Syncs with loading useState
  const loadedPagesRef = useRef(new Set())  // Keeps track of the pages currently loaded
  const scrollModeRef = useRef("idle")      // Keeps track of how browser should handle automatic scrolling
  const scrollContainerRef = useRef(null)   // References the message container
  const prevScrollHeightRef = useRef(0)     // Stores the previous scroll height, before loading old messages

  
  // Sync refs with according react states
  hasMoreRef.current = hasMore  // Tracks whether there are currently more pages to fetch
  loadingRef.current = loading  // Tracks whether we are already currently fetching

  /**
   * Connect to backend websocket on mount
   */
  useEffect(() => {
    socket.connect() 

    // Register listeners first
    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id)
    })

    socket.on("new_post", (post) => {
      console.log("Socket received new post:", post)
      setMessages(prev => 
        prev.map(msg => msg.id === post.tempId ? post : msg)
      )
    })

    return () => {
      socket.off("connect")
      socket.off("new_post")
      socket.disconnect()
    }
  }, [])

  /**
   * Reusable GET function to fetch different pages of posts.
   * 
   * This function is only created once on initial component mount.
   * 
   * @param {Number} pageToLoad - The current page to fetch from database.
   */
  const fetchPosts = useCallback(async (pageToLoad = 1) => {
    
    // Check if page was already loaded before.
    if (loadedPagesRef.current.has(pageToLoad)) {
      return
    }
    
    // Check if already loading, or no more messages to fetch
    if (loadingRef.current || !hasMoreRef.current) return

    try {
      const response = await axios.get("/api/posts/get-posts", {
        params: {
          page: pageToLoad,
          limit: 10
        }
      })

      // Process the array of messages
      const posts = response.data

      // No messages to load, exit
      if (posts.length === 0) {
        hasMoreRef.current = false
        setHasMore(false)
        setLoading(false)
        loadingRef.current = false
        return
      }

      /**
       * Valid messages, reverse the array so that most recent message
       * displays at the bottom of the board.
       */
      posts.reverse()

      // Update posts
      setMessages(prev => {
        const seen = new Set(prev.map(m => m.id))         // Get all of the current posts
        const unique = posts.filter(p => !seen.has(p.id)) // Filter out only new posts
        return [...unique, ...prev]
      })
      
      // Update flags
      loadedPagesRef.current.add(pageToLoad)
      setPage(pageToLoad + 1)

    } catch (err) {
      console.error("Error fetching posts:", err)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [])

  /**
   * Fetches the first page of messages on component mount.
   */
  useEffect(() => {
    fetchPosts(1)
  }, [fetchPosts])

  /**
   * Keeps auto fetching pages on component mount until inital message container 
   * either overflows or no more older messages to load. 
   * 
   * Allows for better scroll handling. Without this the user may be unable to 
   * load existing older messages when the message container isn't overflowed.
   * When the message container is not overflowed, scrolling is disabled by default,
   * which prevents the user from loading older existing messages.
   */
  useEffect(() => {
    // Get message html container
    const container = scrollContainerRef.current 
    if (!container) return 
    
    // Keep loading the next page, until either the message container
    // is scrollable or no more older messages to load.
    if (!isScrollable(container) && hasMore && !loading) fetchPosts(page)

  }, [messages, hasMore, loading, page, fetchPosts])

  /**
   * Updates bottomRef whenever messages state changes.
   * 
   * Allows the message container to automatically scroll dynamically
   * when new messages are added.
   */
  useEffect(() => {
    // Automatically scroll to the bottom when adding messages
    if (scrollModeRef.current === "bottom" || scrollModeRef.current === "idle") {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Preverse the current position when loading previous old messages
    if (scrollModeRef.current === "preserve") {
      const container = scrollContainerRef.current
      const newScrollHeight = container.scrollHeight
      const heightDiff = newScrollHeight - prevScrollHeightRef.current

      container.scrollTop = heightDiff
    }
  }, [messages]) 

  /**
   * Sets setShowForm state to false.
   * Unmounts MessageForm component.
   */
  function closeForm () {
    setShowForm(false)
  }

  /**
   * Submits message form data to backend server for validation.
   * 
   * Backend inserts into DB and returns a sanitized messageForm, if valid.
   * Otherwise, returns error message if something goes wrong.
   * 
   * @param {Object} messageFormData - The username and message input to insert to database.
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
    scrollModeRef.current = "bottom"  // Automatically scroll to the bottom, when adding new message

    // Send POST request to backend server
    try {
      const response = await axios.post("/api/posts/create-post", {...messageFormData, tempId})
      // const savedMessage = response.data
      // console.log(savedMessage)

    } catch (err) {
      // Remove temp message on failure
      setMessages(prev => 
        prev.filter(msg => msg.id !== tempId)
      )

      // Extract backend error message
      const backendErrors = err.response?.data?.errors

      if (backendErrors && Array.isArray(backendErrors)) {
        setMessages(prev => [
          ...prev,
          {
            id: `error-${tempId}`,
            type: "error",
            text: backendErrors.map(e => e.msg).join(". "),
            createAt: Date.now()
          }
        ])
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `error-${tempId}`,
            type: "error",
            text: "Failed to send message. Please try again.",
            createAt: Date.now()
          }
        ])
      }

      console.error("Error submitting message:", err)
    }
  }

  /**
   * Called when user scrolls inside of message container.
   * 
   * Purpose of function is to load more messages when the user
   * scrolls to the top of the container.
   */
  function handleScroll () {
    const container = scrollContainerRef.current

    if (!container) return
    
    // Try to load more messages when the user scrolls to the top
    if (container.scrollTop === 0 && !loading && hasMore) {
      scrollModeRef.current = "preserve"                    // Automatically stay at the scroll height, after loading old messages
      prevScrollHeightRef.current = container.scrollHeight  // Get the current old height

      fetchPosts(page)
    }
  }

  /**
   * Detects whether overflow scrolling exists in the current message container.
   * 
   * @param {*} container - The html message container that holds the message bubbles. 
   * @returns {boolean}   - Returns true if overflow/scrolling does exist in message container,
   *                      - Otherwises false
   */
  function isScrollable (container) {
    return container.scrollHeight > container.clientHeight
  }

  return (
    <main className='h-screen flex items-center justify-center bg-[#0F172A]'>
      <section className='relative flex flex-col border rounded-xl bg-[#1E293B] p-4 w-full max-w-[90%] sm:max-w-[500px] md:max-w-[600px] h-[700px]'>
        
        <div className="flex justify-center py-4">
          <h1
            className="
              relative
              text-2xl md:text-3xl
              font-sans font-extrabold
              text-[#818CF8]
              tracking-tight
              animate-bounce
            "
          >
            Mini Message Board
            <span
              className="
                absolute left-1/2 -bottom-2
                h-1 w-20
                -translate-x-1/2
                rounded-full
                bg-gradient-to-r from-[#818CF8] to-[#6366F1]
              "
            />
          </h1>
        </div>

        <div className='border-t border-gray-600 my-2'></div>

        <div className='flex-1 flex flex-col gap-2 min-h-0'>
          <div 
            className='flex-1 p-2 overflow-y-auto custom-scrollbar'
            onScroll={handleScroll}
            ref={scrollContainerRef}
          >
            {messages.map(msg => (
              <MessageBubble 
                key={msg.id}
                msg={msg}
              />
            ))}
            <div ref={bottomRef}></div>
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
