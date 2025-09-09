import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setMessageInput } from '../../../store/slices/playerMessagesSlice'
import { AppDispatch } from '../../../store'

interface MessageInputProps {
  messageInput: string
  isLoading: boolean
  onSendMessage: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
}

const MessageInput: React.FC<MessageInputProps> = ({
  messageInput,
  isLoading,
  onSendMessage,
  onKeyPress
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const emojis = ['😊', '😂', '❤️', '👍', '👏', '🔥', '💯', '🎾', '🏆', '😎']

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <textarea
            value={messageInput}
            onChange={(e) => dispatch(setMessageInput(e.target.value))}
            onKeyPress={onKeyPress}
            placeholder="Type a message..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none"
            rows={1}
            style={{ minHeight: '38px', maxHeight: '120px' }}
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            😊
          </button>
          
          <button
            onClick={onSendMessage}
            disabled={!messageInput.trim() || isLoading}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
      
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="mt-2 p-2 bg-white border border-gray-200 rounded-md shadow-sm">
          <div className="flex flex-wrap gap-2">
            {emojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  dispatch(setMessageInput(messageInput + emoji))
                  setShowEmojiPicker(false)
                }}
                className="text-lg hover:bg-gray-100 p-1 rounded"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageInput