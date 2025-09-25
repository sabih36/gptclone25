import React from 'react';
import { Conversation } from '../types';
import { PlusIcon, UserIcon, SignOutIcon, ChatBubbleIcon, TrashIcon, KeyIcon } from './Icons';

interface SidebarProps {
    isAuthenticated: boolean;
    onNewChat: () => void;
    onSignIn: () => void;
    onSignOut: () => void;
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onDeleteConversation: (id: string) => void;
    onSetApiKey: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    isAuthenticated, 
    onNewChat, 
    onSignIn, 
    onSignOut,
    conversations,
    activeConversationId,
    onSelectConversation,
    onDeleteConversation,
    onSetApiKey
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

            <div className="border-t border-gray-700 pt-2 space-y-2">
                <button
                    onClick={onSetApiKey}
                    className="flex items-center p-3 rounded-md text-sm font-medium text-white hover:bg-gray-700 w-full text-left"
                >
                    <KeyIcon />
                    <span className="ml-3">Set API Key</span>
                </button>
                {isAuthenticated ? (
                    <>
                        <div className="flex items-center p-3 rounded-md text-sm font-medium text-white">
                            <UserIcon />
                            <span className="ml-3">user@example.com</span>
                        </div>
                        <button 
                            onClick={onSignOut}
                            className="flex items-center p-3 rounded-md text-sm font-medium text-white hover:bg-gray-700 w-full text-left"
                        >
                            <SignOutIcon />
                            <span className="ml-3">Sign Out</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={onSignIn}
                            className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                            Sign Up
                        </button>
                         <button
                            onClick={onSignIn}
                            className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700"
                        >
                            Sign In
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;