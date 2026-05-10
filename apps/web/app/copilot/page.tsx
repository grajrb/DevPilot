'use client';

import { useState } from 'react';
import { Send, Plus, MessageSquare } from 'lucide-react';

export default function CopilotPage() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar - Sessions */}
      <div className="w-64 card flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-white">Sessions</h2>
          <button className="p-1 text-gray-400 hover:text-white">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {['Refactor auth flow', 'Debug API timeout', 'Schema design'].map((session, i) => (
            <button
              key={session}
              className={`w-full text-left px-3 py-2 rounded text-sm ${i === 0 ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50'}`}
            >
              <MessageSquare size={14} className="inline mr-2" />
              {session}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 card flex flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                <p>Start a conversation with DevPilot</p>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-lg px-4 py-2 text-gray-400">
                <span className="inline-block animate-pulse">...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && input.trim()) {
                  // Send message
                  setInput('');
                }
              }}
              placeholder="Ask DevPilot..."
              className="input flex-1"
            />
            <button className="btn-primary px-4">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
