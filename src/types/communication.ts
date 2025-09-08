export interface Message {
  id: number
  sender_id: number
  subject: string
  content: string
  message_type: string
  sent_at: string
  has_attachments: boolean
  sender?: {
    id: number
    username: string
    email: string
    role: string
  }
  attachments?: MessageAttachment[]
  recipients?: MessageRecipient[]
}

export interface MessageRecipient {
  id: number
  message_id: number
  recipient_id: number
  is_read: boolean
  read_at: string | null
  created_at: string
  Message?: Message
  recipient?: {
    id: number
    username: string
    email: string
    role: string
  }
}

export interface MessageAttachment {
  id: number
  message_id: number
  file_name: string
  file_url: string
  file_type: string | null
  file_size: number | null
  created_at: string
}

export interface Notification {
  id: number
  user_id: number
  title: string
  content: string
  notification_type: string
  is_read: boolean
  read_at: string | null
  action_url: string | null
  created_at: string
}

export interface SendMessageRequest {
  recipientIds: number[]
  subject: string
  content: string
  message_type: string
  attachments?: {
    file_name: string
    file_url: string
    file_type?: string
    file_size?: number
  }[]
}

export interface SendBulkMessageRequest {
  targetGroups: string[]
  subject: string
  content: string
  message_type: string
}

export interface MessageFilters {
  is_read?: boolean
  message_type?: string
  limit?: number
  offset?: number
  search?: string
}

export interface NotificationFilters {
  is_read?: boolean
  notification_type?: string
  limit?: number
  offset?: number
}

export interface SendTournamentNotificationRequest {
  tournamentId: number
  title: string
  content: string
}

export interface SendMatchNotificationRequest {
  matchId: number
  title: string
  content: string
}

export interface SendCourtReservationNotificationRequest {
  reservationId: number
  title: string
  content: string
}

export interface SendPlayerMatchRequestNotificationRequest {
  requestId: number
  title: string
  content: string
}

export interface SendPaymentNotificationRequest {
  paymentId: number
  title: string
  content: string
}

export interface MessagesState {
  inbox: {
    messages: MessageRecipient[]
    totalCount: number
  }
  sent: {
    messages: Message[]
    totalCount: number
  }
  currentMessage: {
    message: Message | null
    isSender: boolean
  } | null
  unreadCount: number
  isLoading: boolean
}

export interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  totalCount: number
}