export interface Message {
    id: string;
    content: string;
    sender_name: string;
    sender_email: string;
    created_at: string;
    is_read: boolean;
    has_attachment: boolean;
    attachments: Attachment[];
  }
  
  export interface Attachment {
    id: string;
    file_name: string;
    file_type: string;
    file_url?: string;
    file_size?: number;
  }
  
  export interface ProjectConversation {
    id: string;
    project_id: string;
    project_title: string;
    updated_at: string;
    unread_count: number;
    last_message?: Message;
  }
  
  export interface ChatState {
    activeConversation?: ProjectConversation;
    messages: Message[];
    isLoading: boolean;
    error?: string;
  }