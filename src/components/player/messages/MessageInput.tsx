import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setMessageInput } from '../../../store/slices/playerMessagesSlice'
import { AppDispatch } from '../../../store'
import {
  FiSend,
  FiSmile,
  FiLoader
} from 'react-icons/fi'

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
    <div className="p-6 border-t-2 border-gray-200 bg-gradient-to-r from-white to-gray-50">
      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <div className="relative">
            <textarea
              value={messageInput}
              onChange={(e) => dispatch(setMessageInput(e.target.value))}
              onKeyPress={onKeyPress}
              placeholder="Type a message..."
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none font-medium bg-white shadow-lg"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full flex items-center justify-center hover:from-yellow-500 hover:to-orange-600 focus:outline-none shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-110"
          >
            <FiSmile className="w-6 h-6" />
          </button>

          <button
            onClick={onSendMessage}
            disabled={!messageInput.trim() || isLoading}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-3xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
          >
            {isLoading ? (
              <FiLoader className="w-5 h-5 animate-spin" />
            ) : (
              <FiSend className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="mt-4 p-4 bg-gradient-to-r from-white to-yellow-50 border-2 border-yellow-200 rounded-3xl shadow-xl">
          <div className="flex flex-wrap gap-3">
            {emojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  dispatch(setMessageInput(messageInput + emoji))
                  setShowEmojiPicker(false)
                }}
                className="text-2xl hover:bg-yellow-100 p-3 rounded-2xl transition-all duration-300 hover:transform hover:scale-110 shadow-lg hover:shadow-xl"
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