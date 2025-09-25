import React, { useState } from 'react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

    if (!isOpen) {
        return null;
    }
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, you would handle authentication here.
        // For this demo, we'll just call the success callback.
        onAuthSuccess();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div 
                className="bg-[#202123] rounded-lg shadow-xl p-8 w-full max-w-md text-white"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="flex border-b border-gray-700 mb-6">
                    <button 
                        className={`py-2 px-4 text-lg font-semibold ${activeTab === 'signin' ? 'border-b-2 border-green-500 text-white' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('signin')}
                    >
                        Sign In
                    </button>
                    <button 
                        className={`py-2 px-4 text-lg font-semibold ${activeTab === 'signup' ? 'border-b-2 border-green-500 text-white' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('signup')}
                    >
                        Sign Up
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email address</label>
                            <input 
                                type="email" 
                                id="email"
                                name="email" 
                                required 
                                className="mt-1 block w-full px-3 py-2 bg-[#40414F] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                placeholder="you@example.com" 
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                            <input 
                                type="password" 
                                id="password"
                                name="password" 
                                required 
                                minLength={6}
                                className="mt-1 block w-full px-3 py-2 bg-[#40414F] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                placeholder="••••••••" 
                            />
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        <button
                            type="submit"
                            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-800"
                        >
                            {activeTab === 'signin' ? 'Sign In' : 'Create account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;
