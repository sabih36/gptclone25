import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Role, Conversation } from './types';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import WelcomeScreen from './components/WelcomeScreen';
import Sidebar from './components/Sidebar';
import { aiService } from './services/aiService';
import ApiKeyModal from './components/ApiKeyModal';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAiInitialized, setIsAiInitialized] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial load effect
  useEffect(() => {
    const init = () => {
        const aiReady = aiService.initialize();
        setIsAiInitialized(aiReady);
        if (aiReady) {
            // Start with a new chat on load
            handleNewChat();
        } else {
            setIsApiKeyModalOpen(true);
        }
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeConversationId, isLoading]);
  
  const generateTitle = useCallback(async (prompt: string, conversationId: string) => {
    if (!isAiInitialized) return;
    try {
        const newTitle = await aiService.generateTitle(prompt);
        setConversations(prev => prev.map(convo => 
            convo.id === conversationId ? { ...convo, title: newTitle } : convo
        ));
    } catch (e) {
        console.error("Failed to generate title:", e);
    }
  }, [isAiInitialized]);

  const handleSendMessage = useCallback(async (prompt: string) => {
    if (!isAiInitialized || !activeConversationId) {
      setError("Cannot send message. Service not ready.");
      return;
    }
    if (!prompt.trim()) return;

    const currentConvo = conversations.find(c => c.id === activeConversationId);
    if (!currentConvo) return;
    
    const isFirstMessage = currentConvo.messages.length === 0;

    const userMessage: Message = { id: crypto.randomUUID(), role: Role.USER, content: prompt };
    const modelMessagePlaceholder: Message = { id: crypto.randomUUID(), role: Role.MODEL, content: '' };

    setConversations(prev => prev.map(convo => 
      convo.id === activeConversationId ? { ...convo, messages: [...convo.messages, userMessage, modelMessagePlaceholder] } : convo
    ));
    
    setIsLoading(true);
    setError(null);

    try {
      aiService.startChat(currentConvo.messages); // Pass current history to AI
      const stream = await aiService.sendMessageStream(prompt);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setConversations(prev => prev.map(convo =>
          convo.id === activeConversationId ? { ...convo, messages: convo.messages.map(msg => msg.id === modelMessagePlaceholder.id ? { ...msg, content: fullResponse } : msg) } : convo
        ));
      }
    } catch (e: unknown) {
      const errorMessage = "An error occurred while fetching the response.";
      handleError(e, errorMessage);
      setConversations(prev => prev.map(convo => 
        convo.id === activeConversationId ? {...convo, messages: convo.messages.filter(msg => msg.id !== modelMessagePlaceholder.id)} : convo
      ));
    } finally {
      setIsLoading(false);
      if (isFirstMessage) {
        generateTitle(prompt, activeConversationId);
      }
    }
  }, [isAiInitialized, activeConversationId, conversations, generateTitle]);

  const handleNewChat = () => {
    if (!isAiInitialized) {
      setIsApiKeyModalOpen(true);
      return;
    }
    const newConversation: Conversation = { id: crypto.randomUUID(), title: 'New Chat', messages: [] };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    aiService.startChat([]); // Start a new chat session with no history
    setError(null);
  };
  
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    const convo = conversations.find(c => c.id === id);
    if (convo) {
      aiService.startChat(convo.messages);
    }
  };
  
  const handleDeleteConversation = (id: string) => {
    const updatedConversations = conversations.filter(c => c.id !== id);
    setConversations(updatedConversations);

    if (activeConversationId === id) {
      if (updatedConversations.length > 0) {
        handleSelectConversation(updatedConversations[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  const handleSaveApiKey = async (apiKey: string) => {
    setError(null);
    const success = await aiService.setApiKey(apiKey);
    if (success) {
        setIsAiInitialized(true);
        setIsApiKeyModalOpen(false);
        if (!activeConversationId) {
          handleNewChat();
        }
    } else {
        setError("Failed to initialize AI Service with the provided key. Please check your key and try again.");
    }
};

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation ? activeConversation.messages : [];

  return (
    <>
      <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => { if(isAiInitialized) setIsApiKeyModalOpen(false) }}
          onSave={handleSaveApiKey}
      />
      <div className="flex h-screen w-screen text-gray-100 bg-[#343541]">
        <Sidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            onNewChat={handleNewChat}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        />
        <div className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {isAiInitialized && messages.length === 0 && !isLoading ? (
                <WelcomeScreen onExampleClick={handleSendMessage} />
              ) : isAiInitialized ? (
                messages.map((msg, index) => (
                  <ChatMessage 
                    key={msg.id} 
                    message={msg} 
                    isStreaming={isLoading && index === messages.length - 1 && msg.role === Role.MODEL}
                  />
                ))
              ) : (
                 <div className="flex flex-col items-center justify-center h-full text-center text-gray-200">
                    <h1 className="text-2xl font-bold">Welcome to Gemini Chat Clone</h1>
                    <p className="mt-4">Please set your Gemini API Key to begin.</p>
                     <button 
                        onClick={() => setIsApiKeyModalOpen(true)}
                        className="mt-4 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 transition-colors"
                    >
                        Set API Key
                    </button>
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
    </>
  );
};

export default App;
