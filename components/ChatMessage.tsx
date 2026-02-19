import React from 'react';
import { Bot, User, ChevronRight } from 'lucide-react';
import { DoctorCard } from './DoctorCard';
import { Doctor } from '../types';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'action' | 'doctor-list';
  actionLabel?: string;
  onAction?: () => void;
  doctors?: Doctor[];
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
          ${isUser ? 'bg-secondary text-white' : 'bg-primary text-white'}
        `}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Content Container */}
        <div className="flex flex-col gap-2">
          
          {/* Text Bubble */}
          <div className={`
            p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap
            ${isUser 
              ? 'bg-secondary text-white rounded-tr-none' 
              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}
          `}>
            {message.text}
          </div>

          {/* Action Button (if any) */}
          {message.type === 'action' && message.actionLabel && (
            <button 
              onClick={message.onAction}
              className="bg-accent text-primary font-semibold text-sm px-4 py-3 rounded-xl hover:bg-teal-100 transition-colors flex items-center gap-2 w-fit shadow-sm border border-primary/20 animate-in slide-in-from-left-2 duration-300"
            >
              {message.actionLabel}
              <ChevronRight size={16} />
            </button>
          )}

          {/* Doctor List (if any) */}
          {message.type === 'doctor-list' && message.doctors && (
            <div className="flex flex-col gap-3 mt-1 animate-in slide-in-from-bottom-4 duration-500">
              {message.doctors.map((doc) => (
                <div key={doc.id} className="w-full min-w-[280px]">
                  <DoctorCard doctor={doc} />
                </div>
              ))}
            </div>
          )}
          
          {/* Timestamp */}
          <span className={`text-[10px] text-gray-400 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};