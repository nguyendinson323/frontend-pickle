import { io, Socket } from 'socket.io-client'
import { store } from '../store'
import { addMessage, updateTypingStatus, markMessagesAsRead, updateConversationLastMessage } from '../store/slices/playerMessagesSlice'
import { addNotification } from '../store/slices/notificationSlice'

class SocketService {
  private socket: Socket | null = null
  private isConnected = false

  connect(token: string): void {
    if (this.socket?.connected) {
      return
    }

    const serverUrl = process.env.VITE_API_URL || 'http://localhost:5000'
    
    this.socket = io(serverUrl, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      console.log('Connected to server via Socket.io')
      this.isConnected = true
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason)
      this.isConnected = false
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    // Message events
    this.socket.on('new_message', (message) => {
      // Transform socket message to match Redux slice Message interface
      const transformedMessage = {
        id: message.id,
        conversation_id: message.chatRoomId,
        sender_id: message.sender.id,
        receiver_id: 0, // Will be set by backend
        content: message.content,
        message_type: message.messageType || 'text' as const,
        attachment_url: null,
        is_read: false,
        sent_at: message.sentAt,
        edited_at: null,
        sender: {
          id: message.sender.id,
          full_name: message.sender.player?.full_name || message.sender.username,
          profile_image: message.sender.player?.profile_photo_url || null,
          skill_level: null,
          is_online: true,
          last_seen: null
        }
      }
      
      store.dispatch(addMessage(transformedMessage))
      store.dispatch(updateConversationLastMessage({
        chatRoomId: message.chatRoomId,
        lastMessage: {
          content: message.content,
          sentAt: message.sentAt,
          senderName: message.sender.player?.full_name || message.sender.username
        }
      }))
    })

    this.socket.on('user_typing', (data) => {
      store.dispatch(updateTypingStatus({
        chatRoomId: data.chatRoomId,
        userId: data.userId,
        isTyping: true,
        username: data.username
      }))
    })

    this.socket.on('user_stop_typing', (data) => {
      store.dispatch(updateTypingStatus({
        chatRoomId: data.chatRoomId,
        userId: data.userId,
        isTyping: false
      }))
    })

    this.socket.on('messages_read', (data) => {
      store.dispatch(markMessagesAsRead({
        chatRoomId: data.chatRoomId,
        userId: data.userId,
        messageId: data.messageId
      }))
    })

    // Notification events
    this.socket.on('notification', (notification) => {
      store.dispatch(addNotification({
        id: Date.now(),
        type: notification.type || 'info',
        title: notification.title,
        message: notification.message,
        timestamp: new Date().toISOString(),
        read: false
      }))
    })

    this.socket.on('announcement', (announcement) => {
      store.dispatch(addNotification({
        id: Date.now(),
        type: 'announcement',
        title: announcement.title,
        message: announcement.message,
        timestamp: new Date().toISOString(),
        read: false
      }))
    })

    // Error handling
    this.socket.on('message_error', (error) => {
      console.error('Message error:', error)
      // You could dispatch an error notification here
    })

    this.socket.on('joined_chat', (data) => {
      if (!data.success) {
        console.error('Failed to join chat:', data.error)
      }
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
      console.log('Socket disconnected')
    }
  }

  // Chat methods
  joinChat(chatRoomId: number): void {
    if (this.socket) {
      this.socket.emit('join_chat', { chatRoomId })
    }
  }

  leaveChat(chatRoomId: number): void {
    if (this.socket) {
      this.socket.emit('leave_chat', { chatRoomId })
    }
  }

  sendMessage(chatRoomId: number, content: string, messageType: 'text' | 'image' | 'file' = 'text'): void {
    if (this.socket) {
      this.socket.emit('send_message', {
        chatRoomId,
        content,
        messageType
      })
    }
  }

  startTyping(chatRoomId: number): void {
    if (this.socket) {
      this.socket.emit('typing_start', { chatRoomId })
    }
  }

  stopTyping(chatRoomId: number): void {
    if (this.socket) {
      this.socket.emit('typing_stop', { chatRoomId })
    }
  }

  markAsRead(chatRoomId: number, messageId: number): void {
    if (this.socket) {
      this.socket.emit('mark_read', { chatRoomId, messageId })
    }
  }

  // Utility methods
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true
  }

  getSocket(): Socket | null {
    return this.socket
  }
}

export default new SocketService()