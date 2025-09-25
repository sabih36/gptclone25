import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Role, Conversation } from './types';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import WelcomeScreen from './components/WelcomeScreen';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import ApiKeyModal from './components/ApiKeyModal';
import { aiService } from './services/aiService';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [isAiInitialized, setIsAiInitialized] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = localStorage.getItem('gemini-api-key');
    if (apiKey) {
      handleSaveApiKey(apiKey, true);
    } else {
      setIsApiKeyModalOpen(true);
      setError("Please set your Gemini API Key to start chatting.");
    }
  }, []);
  
  useEffect(() => {
    if (isAiInitialized && conversations.length === 0) {
      handleNewChat();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAiInitialized]);

  const handleError = (e: unknown, defaultMessage: string) => {
    let errorMessage = defaultMessage;
    if (e instanceof Error) {
        errorMessage = `Error: ${e.message}`;
    }
    setError(errorMessage);
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
  
  const handleSaveApiKey = (apiKey: string, isInitialLoad = false) => {
    const success = aiService.initialize(apiKey);
    if (success) {
      localStorage.setItem('gemini-api-key', apiKey);
      setIsAiInitialized(true);
      setIsApiKeyModalOpen(false);
      setApiKeyError(null);
      setError(null); // Clear any initial error
    } else {
      setApiKeyError("Invalid API Key. Please check your key and try again.");
      if (isInitialLoad) {
        localStorage.removeItem('gemini-api-key');
        setIsApiKeyModalOpen(true);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeConversationId, isLoading]);
  
  const generateTitle = useCallback(async (prompt: string) => {
    if (!isAiInitialized || !activeConversationId) return;
    try {
        const newTitle = await aiService.generateTitle(prompt);
        setConversations(prev => prev.map(convo => 
            convo.id === activeConversationId ? { ...convo, title: newTitle } : convo
        ));
    } catch (e) {
        console.error("Failed to generate title:", e);
    }
  }, [isAiInitialized, activeConversationId]);

  const handleSendMessage = useCallback(async (prompt: string) => {
    if (!isAiInitialized || !activeConversationId) {
      setError("AI service is not initialized. Please set your API key.");
      return;
    }
    if (!prompt.trim()) return;

    const currentConvo = conversations.find(c => c.id === activeConversationId);
    if (!currentConvo) return;
    
    const history = currentConvo.messages;
    const isFirstMessage = history.length === 0;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: prompt,
    };
    
    const modelMessagePlaceholder: Message = {
      id: (Date.now() + 1).toString(),
      role: Role.MODEL,
      content: '',
    };

    setConversations(prev => prev.map(convo => 
      convo.id === activeConversationId 
      ? { ...convo, messages: [...convo.messages, userMessage, modelMessagePlaceholder] } 
      : convo
    ));
    
    setIsLoading(true);
    setError(null);

    try {
      aiService.startChat(history);
      const stream = await aiService.sendMessageStream(prompt);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setConversations(prev =>
          prev.map(convo =>
            convo.id === activeConversationId
              ? {
                  ...convo,
                  messages: convo.messages.map(msg =>
                    msg.id === modelMessagePlaceholder.id ? { ...msg, content: fullResponse } : msg
                  ),
                }
              : convo
          )
        );
      }
    } catch (e: unknown) {
      const errorMessage = "An error occurred while fetching the response.";
      handleError(e, errorMessage);
      setConversations(prev => prev.map(convo => 
        convo.id === activeConversationId 
        ? {...convo, messages: convo.messages.filter(msg => msg.id !== modelMessagePlaceholder.id)} 
        : convo
      ));
    } finally {
      setIsLoading(false);
      if (isFirstMessage) {
        generateTitle(prompt);
      }
    }
  }, [isAiInitialized, activeConversationId, conversations, generateTitle]);

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
            onSetApiKey={() => {
              setApiKeyError(null);
              setIsApiKeyModalOpen(true);
            }}
        />
        <div className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {messages.length === 0 && !isLoading && isAiInitialized ? (
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
              {!isAiInitialized && !isApiKeyModalOpen && (
                 <div className="flex flex-col items-center justify-center h-full text-center text-gray-200">
                    <h1 className="text-2xl font-bold">Welcome to Gemini Chat Clone</h1>
                    <p className="mt-4">Please set your API key to begin.</p>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="w-full bg-[#343541] border-t border-gray-600/50">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {error && <p className="text-red-400 text-center text-sm mb-2">{error}</p>}
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} disabled={!isAiInitialized} />
                <p className="text-xs text-center text-gray-400 mt-2">
                  Gemini ChatGPT Clone. This is a demo and may not be perfect.
                </p>
              </div>
          </div>
        </div>
      </div>
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen}
        onSave={handleSaveApiKey}
        errorMessage={apiKeyError}
      />
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
