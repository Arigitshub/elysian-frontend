'use client';

import TherapistCanvas from '@/components/canvas/TherapistCanvas';
import { Mic, MessageSquare, Settings, Heart, Send } from 'lucide-react';
import { useElysianSync } from '@/hooks/useElysianSync';
import { useState } from 'react';

export default function Home() {
  const { status, messages, sendMessage } = useElysianSync();
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const lastMessage = messages[messages.length - 1];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#020205] text-white font-sans">
      {/* 3D Therapist Layer */}
      <div className="absolute inset-0 z-0">
        <TherapistCanvas />
      </div>

      {/* Glassmorphic UI Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
        {/* Header */}
        <header className="p-8 flex justify-between items-center pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-xl transition-all duration-1000 ${status === 'CONNECTED' ? 'bg-[#efd36d] shadow-[0_0_20px_rgba(239,211,109,0.5)]' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}>
              Æ
            </div>
            <div>
              <h1 className="text-xl font-light tracking-[0.2em] uppercase">Elysian Soul</h1>
              <p className="text-[10px] text-white/40 tracking-[0.4em] uppercase">
                {status === 'CONNECTED' ? 'Resonance Established' : 'Syncing Link...'}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Center Content */}
        <div className="flex-1" />

        {/* Footer Controls */}
        <footer className="p-12 flex flex-col items-center gap-8 pointer-events-auto">
          {/* AI Response Display */}
          <div className="bg-black/40 backdrop-blur-3xl border border-white/10 p-6 rounded-[32px] max-w-2xl w-full text-center shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <p className="text-lg font-medium text-white/80 italic leading-relaxed min-h-[1.5em]">
              {lastMessage ? `"${lastMessage.text}"` : '"I\'m here for you. Whenever you\'re ready, we can begin our session."'}
            </p>
          </div>

          <div className="flex items-center gap-6 w-full max-w-md">
            <div className="flex-1 flex bg-white/5 rounded-full border border-white/10 overflow-hidden px-4 py-2 items-center backdrop-blur-xl">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Share your thoughts..." 
                className="bg-transparent border-none outline-none flex-1 py-2 px-2 text-white/80 placeholder:text-white/20"
              />
              <button 
                onClick={handleSend}
                className="p-2 hover:text-[#efd36d] transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
            
            <button className="w-20 h-20 bg-[#efd36d] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(239,211,109,0.4)] hover:scale-105 transition-all group relative text-black shrink-0">
              <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping opacity-20" />
              <Mic size={32} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </footer>
      </div>

      {/* Decorative Noise / Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] contrast-150 brightness-150 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </main>
  );
}
