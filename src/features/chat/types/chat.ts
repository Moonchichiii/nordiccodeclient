export interface Message {
    id: string;
    content: string;
    sender_name: string;
    sender_email: string;
    created_at: string;
    is_read: boolean;
    has_attachment: boolean;
    attachments: Array<{
      id: string;
      file_name: string;
      file_type: string;
    }>;
  }
  
  export interface ConversationProps {
    projectTitle?: string;
    conversationId: string;
    currentUserEmail: string;
    onBack?: () => void;
  }
  
  export interface Contact {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
    status: 'online' | 'offline' | 'away';
    last_seen?: string;
    unread_count: number;
    last_message?: {
      content: string;
      timestamp: string;
    };
  }