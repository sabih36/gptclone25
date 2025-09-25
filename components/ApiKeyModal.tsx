import React, { useState } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-[#202123] p-6 rounded-lg shadow-xl w-full max-w-md m-4 text-white border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Set Your Gemini API Key</h2>
        <p className="text-gray-400 mb-4 text-sm">
          To use this application, you need to provide your own Google Gemini API key. You can get one from{' '}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Google AI Studio
          </a>
          .
        </p>
        <div className="mb-4">
          <label htmlFor="apiKeyInput" className="block text-sm font-medium text-gray-300 mb-2">
            API Key
          </label>
          <input
            id="apiKeyInput"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Enter your API key here"
            className="w-full p-2 bg-[#40414F] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            autoComplete="off"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
            aria-label="Close modal"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
            aria-label="Save API key"
          >
            Save Key
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4">
            Your API key is stored only in your browser's local storage and is not sent anywhere else.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyModal;
