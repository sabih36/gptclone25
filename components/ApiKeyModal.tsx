import React, { useState } from 'react';

interface ApiKeyModalProps {
    isOpen: boolean;
    onSave: (apiKey: string) => void;
    errorMessage?: string | null;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, errorMessage }) => {
    const [apiKey, setApiKey] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onSave(apiKey.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#202123] rounded-lg shadow-xl p-8 w-full max-w-md text-white">
                <form onSubmit={handleSave}>
                    <h2 className="text-2xl font-bold mb-4">Enter your Gemini API Key</h2>
                    <p className="text-gray-400 mb-6">
                        To use this app, you need to provide your own Google Gemini API key. You can get one from{' '}
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                            Google AI Studio
                        </a>. Your key is stored only in your browser.
                    </p>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full px-3 py-2 bg-[#40414F] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your API key"
                        aria-label="Gemini API Key"
                    />
                    {errorMessage && <p className="text-red-400 text-sm mt-2">{errorMessage}</p>}
                    <button
                        type="submit"
                        className="w-full mt-6 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-800 disabled:opacity-50"
                        disabled={!apiKey.trim()}
                    >
                        Save and Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApiKeyModal;
