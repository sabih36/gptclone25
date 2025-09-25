import React from 'react';
import { Message, Role } from '../types';
import { UserIcon, GeminiIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isStreaming }) => {
  const isUser = message.role === Role.USER;
  const wrapperClass = isUser ? 'bg-[#343541]' : 'bg-[#444654] border-b border-gray-900/50';
  const contentClass = message.isError ? 'text-red-400' : '';

  const formatContent = (content: string) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = content.split(codeBlockRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const langMatch = part.match(/^(.*?)\n/);
        const language = langMatch ? langMatch[1] : '';
        const code = langMatch ? part.substring(langMatch[0].length) : part;

        return (
          <div key={index} className="bg-black rounded-md my-4">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-700 rounded-t-md">
              <span className="text-xs text-gray-300">{language}</span>
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
              <code>{code.trim()}</code>
            </pre>
          </div>
        );
      }
      // Use a regex to bold text between **
      const boldedParts = part.split(/(\*\*.*?\*\*)/g);
      return boldedParts.map((boldedPart, boldedIndex) => {
        if (boldedPart.startsWith('**') && boldedPart.endsWith('**')) {
          return <strong key={boldedIndex}>{boldedPart.slice(2, -2)}</strong>;
        }
        return <span key={boldedIndex} className="whitespace-pre-wrap leading-relaxed">{boldedPart}</span>;
      });
    });
  };

  const Cursor = () => <span className="animate-pulse">▍</span>;

  return (
    <div className={`p-4 ${wrapperClass}`}>
      <div className="flex items-start space-x-4 max-w-3xl mx-auto">
        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-600">
          {isUser ? <UserIcon /> : <GeminiIcon />}
        </div>
        <div className={`flex-1 overflow-x-auto ${contentClass} pt-1`}>
          {message.content ? formatContent(message.content) : null}
          {isStreaming && <Cursor />}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
