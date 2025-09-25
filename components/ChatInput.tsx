
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSubmit = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative flex items-end w-full">
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message ChatGPT Clone..."
        rows={1}
        className="w-full resize-none p-4 pr-12 text-gray-100 bg-[#40414F] rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500"
        disabled={isLoading}
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading || !inputValue.trim()}
        className="absolute right-3 bottom-3 p-2 rounded-lg bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </div>
  );
};

export default ChatInput;
