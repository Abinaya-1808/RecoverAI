import React, { useState } from 'react';
import { X, Send, Sparkles, Bot, ArrowRight, CornerDownLeft } from 'lucide-react';
import { queryAICopilot } from '../../services/aiService';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const [messages, setMessages] = useState<Array<{
    sender: 'user' | 'ai';
    text: string;
    metrics?: Array<{ label: string; value: string }>;
    actions?: Array<{ label: string; route: string }>;
  }>>([
    {
      sender: 'ai',
      text: "👋 Hi Alex! I'm your RecoverAI Copilot. How can I help optimize your revenue recovery today?",
      actions: [
        { label: 'Why did recovery drop this week?', route: '/analytics' },
        { label: 'Which customers should I prioritize?', route: '/dashboard' },
        { label: 'How much revenue can we recover?', route: '/simulator' },
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    if (!textToSend) setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const response = queryAICopilot(queryText);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: response.text,
          metrics: response.metrics,
          actions: response.actions,
        }
      ]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-lg bg-[#0d1322] border-l border-emerald-500/20 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                RecoverAI Copilot
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  GPT-4o / ML v4
                </span>
              </h3>
              <p className="text-xs text-slate-400">Intelligent Payment Rescue Assistant</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'glass-card border-slate-700/60 text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mb-1.5">
                    <Sparkles className="w-3 h-3" /> RecoverAI Intelligence
                  </div>
                )}
                {msg.text}

                {/* Render Metrics if available */}
                {msg.metrics && msg.metrics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-700/40">
                    {msg.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="bg-slate-900/80 p-2 rounded border border-slate-700/50">
                        <div className="text-[10px] text-slate-400">{m.label}</div>
                        <div className="font-bold text-white text-xs mt-0.5">{m.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Render Interactive Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-700/40">
                    {msg.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => {
                          onNavigate(act.route);
                          onClose();
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition-colors"
                      >
                        {act.label} <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-3 glass-card rounded-xl w-fit">
              <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Scanning payment telemetry & calculating recovery signals...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Copilot (e.g. 'Show high-risk customers')..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleSend()}
              className="absolute right-2 top-2 p-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
            <span>Press Enter <CornerDownLeft className="w-2.5 h-2.5 inline" /> to send</span>
            <span className="text-emerald-400 font-mono">Live Telemetry Connected</span>
          </div>
        </div>

      </div>
    </div>
  );
};
