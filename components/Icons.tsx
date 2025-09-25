import React from 'react';

export const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

export const GeminiIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C11.4696 2 11 2.46957 11 3V4.33333C11 4.86377 11.4696 5.33333 12 5.33333C12.5304 5.33333 13 4.86377 13 4.33333V3C13 2.46957 12.5304 2 12 2ZM12 18.6667C11.4696 18.6667 11 19.1362 11 19.6667V21C11 21.5304 11.4696 22 12 22C12.5304 22 13 21.5304 13 21V19.6667C13 19.1362 12.5304 18.6667 12 18.6667ZM4.92893 4.92893C4.53841 4.53841 3.90524 4.53841 3.51472 4.92893C3.1242 5.31946 3.1242 5.95262 3.51472 6.34315L4.57513 7.40355C4.96565 7.79408 5.59882 7.79408 5.98934 7.40355C6.37986 7.01303 6.37986 6.37987 5.98934 5.98934L4.92893 4.92893ZM18.0107 18.0107C17.6201 17.6201 16.987 17.6201 16.5964 18.0107C16.2059 18.4012 16.2059 19.0344 16.5964 19.4249L17.6569 20.4853C18.0474 20.8758 18.6805 20.8758 19.0711 20.4853C19.4616 20.0948 19.4616 19.4616 19.0711 19.0711L18.0107 18.0107ZM4.33333 11H3C2.46957 11 2 11.4696 2 12C2 12.5304 2.46957 13 3 13H4.33333C4.86377 13 5.33333 12.5304 5.33333 12C5.33333 11.4696 4.86377 11 4.33333 11ZM21 11H19.6667C19.1362 11 18.6667 11.4696 18.6667 12C18.6667 12.5304 19.1362 13 19.6667 13H21C21.5304 13 22 12.5304 22 12C22 11.4696 21.5304 11 21 11ZM7.40355 4.57513C7.01303 4.18461 6.37987 4.18461 5.98934 4.57513L4.92893 5.63553C4.53841 6.02606 4.53841 6.65922 4.92893 7.04975C5.31946 7.44027 5.95262 7.44027 6.34315 7.04975L7.40355 5.98934C7.79408 5.59882 7.79408 4.96565 7.40355 4.57513ZM19.4249 16.5964C19.0344 16.2059 18.4012 16.2059 18.0107 16.5964L16.9503 17.6569C16.5598 18.0474 16.5598 18.6805 16.9503 19.0711C17.3408 19.4616 17.9739 19.4616 18.3645 19.0711L19.4249 18.0107C19.8154 17.6201 19.8154 16.987 19.4249 16.5964Z" fill="currentColor"/>
    </svg>
);

export const SendIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
        <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
);

export const GeminiTextIcon: React.FC = () => (
    <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Gemini</span>
);

export const SunIcon: React.FC = () => (
  <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
);

export const BoltIcon: React.FC = () => (
  <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
);

export const TriangleExclamationIcon: React.FC = () => (
  <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
);

export const PlusIcon: React.FC = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
);

export const ChatBubbleIcon: React.FC = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
);

export const TrashIcon: React.FC = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
);