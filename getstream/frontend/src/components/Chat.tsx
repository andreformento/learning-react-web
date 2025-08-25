import React, { useState, useEffect, useRef } from 'react'
import { useStream } from '../contexts/StreamContext'

interface Message {
  id: string
  text: string
  user: { id: string }
  created_at: Date
}

const Chat: React.FC = () => {
  const { chatClient, currentUser, isAuthenticated } = useStream()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [channel, setChannel] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isAuthenticated && chatClient && currentUser) {
      initializeChat()
    }
  }, [isAuthenticated, chatClient, currentUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeChat = async () => {
    if (!chatClient || !currentUser) return

    try {
      setIsLoading(true)

      const channel = chatClient.channel('messaging', 'general', {
        name: 'General Chat',
        members: [currentUser.id]
      })

      await channel.watch()
      setChannel(channel)

      channel.on('message.new', (event: any) => {
        setMessages(prev => [...prev, event.message])
      })

      const response = await channel.getMessages()
      setMessages(response.messages || [])
    } catch (error) {
      console.error('Error initializing chat:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!channel || !newMessage.trim()) return

    try {
      await channel.sendMessage({
        text: newMessage
      })
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message.')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="chat">
        <h1>Chat</h1>
        <p>Please log in to access the chat.</p>
      </div>
    )
  }

  return (
    <div className="chat">
      <h1>General Chat</h1>

      {isLoading ? (
        <div className="chat-loading">
          <p>Initializing chat...</p>
        </div>
      ) : (
        <>
          <div className="chat-messages">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.user.id === currentUser?.id ? 'own-message' : 'other-message'}`}
                >
                  <div className="message-header">
                    <strong>{message.user.id}</strong>
                    <small>{new Date(message.created_at).toLocaleTimeString()}</small>
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              ))
            ) : (
              <p className="no-messages">No messages yet. Start the conversation!</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chat-input-form">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!channel}
            />
            <button type="submit" disabled={!channel || !newMessage.trim()}>
              Send
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default Chat
