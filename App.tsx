import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, Role, Conversation } from './types';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import WelcomeScreen from './components/WelcomeScreen';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!process.env.API_KEY) {
        setError("API_KEY environment variable not set.");
        return;
      }
      const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
      setAi(genAI);
    } catch (e: unknown) {
      handleError(e, "An unknown error occurred during initialization.");
    }
  }, []);
  
  // Initialize first chat on load
  useEffect(() => {
    if (conversations.length === 0) {
      handleNewChat();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleError = (e: unknown, defaultMessage: string) => {
    let errorMessage = defaultMessage;
    if (e instanceof Error) {
        errorMessage = `Error: ${e.message}`;
    }
    setError(errorMessage);
    // Optionally update the active conversation with an error message
    if(activeConversationId) {
       setConversations(prev => prev.map(convo => {
          if (convo.id === activeConversationId) {
            return {
              ...convo,
              messages: [...convo.messages, {id: 'error-' + Date.now(), role: Role.MODEL, content: errorMessage, isError: true}]
            }
          }
          return convo;
       }));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeConversationId, isLoading]);
  
  const generateTitle = useCallback(async (prompt: string) => {
    if (!ai || !activeConversationId) return;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a short, concise title (4-5 words max) for this user prompt: "${prompt}"`,
        });
        const newTitle = response.text.replace(/"/g, ''); // Clean up quotes
        setConversations(prev => prev.map(convo => 
            convo.id === activeConversationId ? { ...convo, title: newTitle } : convo
        ));
    } catch (e) {
        console.error("Failed to generate title:", e);
        // Silently fail, keep "New Chat" title
    }
  }, [ai, activeConversationId]);

  const handleSendMessage = useCallback(async (prompt: string) => {
    if (!ai || !activeConversationId) {
      setError("AI service is not initialized or no active chat.");
      return;
    }
    if (!prompt.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: prompt,
    };
    
    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const isFirstMessage = activeConversation && activeConversation.messages.length === 0;

    setConversations(prev => prev.map(convo => 
      convo.id === activeConversationId ? { ...convo, messages: [...convo.messages, userMessage] } : convo
    ));
    
    setIsLoading(true);
    setError(null);

    const modelMessageId = (Date.now() + 1).toString();
    const modelMessagePlaceholder: Message = {
      id: modelMessageId,
      role: Role.MODEL,
      content: '',
    };

    setConversations(prev => prev.map(convo => 
      convo.id === activeConversationId ? { ...convo, messages: [...convo.messages, modelMessagePlaceholder] } : convo
    ));

    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: activeConversation?.messages.slice(0, -2).map(msg => ({
                role: msg.role === Role.USER ? 'user' : 'model',
                parts: [{ text: msg.content }]
            })) ?? [],
            config: {
                systemInstruction: 'You are a helpful assistant, designed to be a clone of ChatGPT. Your responses should be informative, well-structured, and engaging.',
            },
        });
        
      const stream = await chat.sendMessageStream({ message: prompt });
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setConversations(prev =>
          prev.map(convo =>
            convo.id === activeConversationId
              ? {
                  ...convo,
                  messages: convo.messages.map(msg =>
                    msg.id === modelMessageId ? { ...msg, content: fullResponse } : msg
                  ),
                }
              : convo
          )
        );
      }
    } catch (e: unknown) {
      const errorMessage = "An error occurred while fetching the response.";
      handleError(e, errorMessage);
      // Remove placeholder on error
      setConversations(prev => prev.map(convo => 
        convo.id === activeConversationId 
        ? {...convo, messages: convo.messages.filter(msg => msg.id !== modelMessageId)} 
        : convo
      ));
    } finally {
      setIsLoading(false);
      if (isFirstMessage) {
        generateTitle(prompt);
      }
    }
  }, [ai, activeConversationId, conversations, generateTitle]);

  const handleNewChat = () => {
    const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        title: 'New Chat',
        messages: [],
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setError(null);
  };
  
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };
  
  const handleDeleteConversation = (id: string) => {
    const updatedConversations = conversations.filter(c => c.id !== id);
    setConversations(updatedConversations);

    if (activeConversationId === id) {
      if (updatedConversations.length > 0) {
        setActiveConversationId(updatedConversations[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation ? activeConversation.messages : [];

  return (
    <>
      <div className="flex h-screen w-screen text-gray-100 bg-[#343541]">
        <Sidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            isAuthenticated={isAuthenticated}
            onNewChat={handleNewChat}
            onSignIn={() => setIsAuthModalOpen(true)}
            onSignOut={() => setIsAuthenticated(false)}
        />
        <div className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {messages.length === 0 && !isLoading ? (
                <WelcomeScreen onExampleClick={handleSendMessage} />
              ) : (
                messages.map((msg, index) => (
                  <ChatMessage 
                    key={msg.id} 
                    message={msg} 
                    isStreaming={isLoading && index === messages.length - 1 && msg.role === Role.MODEL && msg.content === ''}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="w-full bg-[#343541] border-t border-gray-600/50">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {error && <p className="text-red-400 text-center text-sm mb-2">{error}</p>}
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                <p className="text-xs text-center text-gray-400 mt-2">
                  Gemini ChatGPT Clone. This is a demo and may not be perfect.
                </p>
              </div>
          </div>
        </div>
      </div>
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {
          setIsAuthenticated(true);
          setIsAuthModalOpen(false);
        }}
      />
    </>
  );
};

export default App;