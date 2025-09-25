import React from 'react';
import { Conversation } from '../types';
import { PlusIcon, ChatBubbleIcon, TrashIcon, CogIcon } from './Icons';

interface SidebarProps {
    onNewChat: () => void;
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onDeleteConversation: (id: string) => void;
    onOpenApiKeyModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    onNewChat, 
    conversations,
    activeConversationId,
    onSelectConversation,
    onDeleteConversation,
    onOpenApiKeyModal,
}) => {
    return (
        <div className="flex flex-col w-64 bg-[#202123] p-2">
            <button 
                onClick={onNewChat}
                className="flex items-center p-3 rounded-md text-sm font-medium text-white hover:bg-gray-700/80 w-full text-left border border-gray-700 mb-2"
            >
                <PlusIcon />
                <span className="ml-3">New Chat</span>
            </button>
            
            <div className="flex-grow overflow-y-auto pr-1">
                <div className="space-y-1">
                  {conversations.map(convo => (
                      <div key={convo.id} className="relative group">
                          <button
                              onClick={() => onSelectConversation(convo.id)}
                              className={`flex items-center p-3 rounded-md text-sm text-white w-full text-left truncate transition-colors ${
                                  activeConversationId === convo.id ? 'bg-gray-700' : 'hover:bg-gray-700/50'
                              }`}
                              title={convo.title}
                          >
                              <ChatBubbleIcon />
                              <span className="ml-3 flex-1">{convo.title}</span>
                          </button>
                          <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteConversation(convo.id);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label={`Delete chat: ${convo.title}`}
                          >
                              <TrashIcon />
                          </button>
                      </div>
                  ))}
                </div>
            </div>
            
            <div className="pt-2 border-t border-gray-700">
                <button
                    onClick={onOpenApiKeyModal}
                    className="flex items-center p-3 rounded-md text-sm font-medium text-white hover:bg-gray-700/80 w-full text-left"
                    aria-label="Open API key settings"
                >
                    <CogIcon />
                    <span className="ml-3">API Key Settings</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
