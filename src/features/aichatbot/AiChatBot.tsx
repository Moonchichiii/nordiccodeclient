import React, { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import gsap from 'gsap';
import { Bot, X, Send, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import { useChatbot } from '@/features/aichatbot/hooks/useChatbot';
import { ChatMessage } from '@/features/aichatbot/types/chatbotTypes';

const scrollToBottom = (element: HTMLDivElement): void => {
  gsap.to(element, {
    scrollTop: element.scrollHeight,
    duration: 0.3,
    ease: 'power2.out'
  });
};

const AiChatBot: React.FC = (): JSX.Element => {
  // Chat window states
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // Use the custom chatbot hook
  const { messages, sendMessage, isLoading } = useChatbot();

  // Refs for animations and scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonIconRef = useRef<HTMLDivElement>(null);
  const buttonGlowRef = useRef<HTMLDivElement>(null);

  // Hover animation for the floating button
  useEffect((): (() => void) => {
    if (!buttonRef.current || !buttonIconRef.current || !buttonGlowRef.current) return (): void => {};

    const button = buttonRef.current;
    const icon = buttonIconRef.current;
    const glow = buttonGlowRef.current;
    const tl = gsap.timeline({ paused: true });

    tl.to(button, {
      scale: 1.1,
      duration: 0.3,
      ease: 'power2.out'
    })
      .to(
        icon,
        {
          scale: 1.2,
          rotate: '15deg',
          duration: 0.4,
          ease: 'elastic.out(1, 0.3)'
        },
        0
      )
      .to(
        glow,
        {
          opacity: 1,
          scale: 1.5,
          duration: 0.4,
          ease: 'power2.out'
        },
        0
      );

    const handleMouseEnter = (): void => tl.play();
    const handleMouseLeave = (): void => tl.reverse();

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return (): void => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Chat window open/close and button visibility animations
  useEffect((): void => {
    if (isOpen && chatWindowRef.current) {
      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'back.in(1.5)'
        });
      }
      gsap.fromTo(
        chatWindowRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.75)' }
      );
    } else if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        delay: 0.2,
        ease: 'elastic.out(1, 0.75)'
      });
    }
  }, [isOpen]);

  // Minimize/Maximize animation
  useEffect((): void => {
    if (chatWindowRef.current) {
      gsap.to(chatWindowRef.current, {
        height: isMinimized ? 'auto' : '600px',
        duration: 0.4,
        ease: 'power4.inOut'
      });
    }
  }, [isMinimized]);

  // Animate new messages and scroll to bottom
  useEffect((): void => {
    const newMessages = document.querySelectorAll('.message-new');
    newMessages.forEach((msg: Element): void => {
      gsap.fromTo(
        msg,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.75)' }
      );
    });
    if (messagesEndRef.current) {
      scrollToBottom(messagesEndRef.current);
    }
  }, [messages]);

  // Handle form submission and send the message
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      if (!message.trim()) return;
      sendMessage(message);
      setMessage('');
    },
    [message, sendMessage]
  );

  return (
    <>
      {/* Floating Button */}
      <button
        ref={buttonRef}
        onClick={(): void => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[100] p-4 rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 overflow-hidden"
        type="button"
      >
        <div ref={buttonGlowRef} className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 rotate-45 scale-0" />
        <div ref={buttonIconRef} className="relative">
          <Bot className="w-6 h-6" />
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="fixed bottom-6 left-6 z-[100] w-96 rounded-xl bg-card border border-border shadow-2xl overflow-hidden opacity-0"
          style={{ height: isMinimized ? 'auto' : '600px' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-border bg-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="font-medium">AI Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(): void => setIsMinimized((prev) => !prev)}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                type="button"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={(): void => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <div ref={messagesEndRef} className="h-[calc(600px-132px)] overflow-y-auto p-4 space-y-4">
              {messages.map((msg: ChatMessage): JSX.Element => (
                <div key={msg.id} className={`flex message-new ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${msg.isBot ? 'bg-card border border-border' : 'bg-primary text-primary-foreground'}`}>
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs mt-1 opacity-60">{msg.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start message-new">
                  <div className="bg-card border border-border rounded-lg p-3">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input Area */}
          {!isMinimized && (
            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e): void => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 hover:border-primary/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default AiChatBot;