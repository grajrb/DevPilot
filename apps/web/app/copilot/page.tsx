'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Plus, MessageSquare, Bot, User } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Session {
  id: string;
  title: string;
  createdAt: string;
}

const mockSessions: Session[] = [
  { id: '1', title: 'Refactor auth flow', createdAt: '2 hours ago' },
  { id: '2', title: 'Debug API timeout', createdAt: 'Yesterday' },
  { id: '3', title: 'Schema design for evaluations', createdAt: '3 days ago' },
  { id: '4', title: 'Optimize RAG pipeline', createdAt: '1 week ago' },
];

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState('1');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: `I've analyzed your request regarding "${input.slice(0, 30)}..." ` +
          `Here's what I found:\n\nBased on the available documentation and best practices, ` +
          `I recommend the following approach:\n\n1. Review the current implementation\n` +
          `2. Consider the impact on existing services\n` +
          `3. Test thoroughly before deployment\n\nWould you like me to elaborate on any specific aspect?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar - Sessions */}
      <div className="w-64 card flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-white text-sm">Sessions</h2>
          <button className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-800">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {mockSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setActiveSession(session.id)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                activeSession === session.id
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <MessageSquare size={14} className="inline mr-2 flex-shrink-0" />
              <span className="truncate">{session.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 card flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Bot size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium text-gray-400">Start a conversation</p>
                <p className="text-sm mt-1">Ask DevPilot about your services, code, or documentation</p>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-gray-800 rounded-lg px-4 py-3 text-gray-400">
                <span className="inline-flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask DevPilot..."
              className="input flex-1"
              disabled={isLoading}
            />
            <button
              className="btn-primary px-4"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            DevPilot may produce inaccurate information. Verify important facts.
          </p>
        </div>
      </div>
    </div>
  );
}