
import React from 'react';
import { GeminiTextIcon, SunIcon, BoltIcon, TriangleExclamationIcon } from './Icons';

interface WelcomeScreenProps {
    onExampleClick: (prompt: string) => void;
}

const ExamplePrompt: React.FC<{ title: string, subtitle: string, onClick: () => void }> = ({ title, subtitle, onClick }) => (
    <button
      onClick={onClick}
      className="bg-[#40414F] p-4 rounded-lg text-left w-full hover:bg-gray-600 transition-colors"
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </button>
);


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
    const examples = [
        { title: "Plan a trip", subtitle: "to see the Northern Lights in Norway" },
        { title: "Write a thank-you note", subtitle: "to my interviewer" },
        { title: "Explain supercavitation", subtitle: "like I'm five years old" },
        { title: "Give me ideas", subtitle: "for what to do with my kids' art" },
    ];
    
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-200">
            <div className="mb-8">
                <GeminiTextIcon />
            </div>
            <h1 className="text-4xl font-bold mb-12">How can I help you today?</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-12">
                {examples.map(ex => (
                    <ExamplePrompt 
                        key={ex.title} 
                        title={ex.title} 
                        subtitle={ex.subtitle} 
                        onClick={() => onExampleClick(`${ex.title} ${ex.subtitle}`)}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-sm">
                <div className="flex flex-col items-center">
                    <SunIcon />
                    <h3 className="font-semibold mt-2 mb-1">Examples</h3>
                    <p className="bg-[#40414F] p-2 rounded-lg text-xs w-full mb-1">"Explain quantum computing in simple terms"</p>
                    <p className="bg-[#40414F] p-2 rounded-lg text-xs w-full mb-1">"Got any creative ideas for a 10 year old’s birthday?"</p>
                    <p className="bg-[#40414F] p-2 rounded-lg text-xs w-full">"How do I make an HTTP request in Javascript?"</p>
                </div>
                 <div className="flex flex-col items-center">
                    <BoltIcon />
                    <h3 className="font-semibold mt-2 mb-1">Capabilities</h3>
                    <p className="bg-[#40414F] p-2 rounded-lg text-xs w-full mb-1">Remembers what user said earlier in the conversation</p>
                    <p className="bg-[#40414F] p-2 rounded-lg text-xs w-full mb-1">Allows user to provide follow-up corrections</p>
                    <p className="bg-[#40414F] p-2 rounded-lg text-xs w-full">Trained to decline inappropriate requests</p>
                </div>
                 <div className="flex flex-col items-center">
                    <TriangleExclamationIcon />
                    <h3 className="font-semibold mt-2 mb-1">Limitations</h3>
                    <p className="bg-[#40414F] p-2 rounded-lg text-xs w-full mb-1">May occasionally generate incorrect information</p>
                    <p className="bg-[#40414F] p-2 rounded-lg text-xs w-full mb-1">May occasionally produce harmful instructions or biased content</p>
                    <p className="bg-[#40414F] p-2 rounded-lg text-xs w-full">Limited knowledge of world and events after 2023</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
