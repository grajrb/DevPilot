'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Plus, MessageSquare, Bot, User, Trash2, Sparkles } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: { title: string; relevance: number }[];
}

interface Session {
  id: string;
  title: string;
  createdAt: string;
  messageCount: number;
}

const mockSessions: Session[] = [
  { id: '1', title: 'Refactor auth flow', createdAt: '2 hours ago', messageCount: 8 },
  { id: '2', title: 'Debug API timeout', createdAt: 'Yesterday', messageCount: 5 },
  { id: '3', title: 'Schema design for evaluations', createdAt: '3 days ago', messageCount: 12 },
  { id: '4', title: 'Optimize RAG pipeline', createdAt: '1 week ago', messageCount: 3 },
];

const streamingResponses: Record<string, string[]> = {
  'refactor': [
    'I\'ll help you refactor the auth flow. Here\'s my analysis:',
    'The current implementation uses JWT with a single strategy. I recommend:',
    '1. **Separate concerns** — Split auth into login, refresh, and logout handlers',
    '2. **Add rate limiting** — Prevent brute force on login endpoints',
    '3. **Use refresh tokens** — Store in HttpOnly cookies for security',
    '4. **Add session management** — Track active sessions in Redis',
    '\n\nWould you like me to generate the code for any of these improvements?'
  ],
  'debug': [
    'Let me debug that API timeout issue.',
    'Checking recent traces... I can see the `/api/services` endpoint is timing out after 30s.',
    '**Root cause**: The database query for service health checks is unoptimized — it\'s doing N+1 queries for each service\'s endpoints.',
    '**Fix**: Add eager loading with `relations: [\'endpoints\']` and paginate results.',
    '\n\nHere\'s the fix:',
    '```typescript\nconst services = await this.serviceRepo.find({\n  where: { tenantId },\n  relations: [\'endpoints\'],\n  take: 50,\n});\n```',
    'This should reduce latency from 30s to ~200ms. Want me to deploy this?'
  ],
  'default': [
    'I understand your question. Let me search the documentation and knowledge base.',
    'Based on the available context, here\'s what I found:',
    'The DevPilot platform supports multi-tenant RAG queries with automatic tenant isolation. Documents are chunked, embedded, and stored in pgvector for semantic search.',
    '**Key points**:',
    '• Documents are parsed (PDF, DOCX, Markdown) and chunked into 500-token segments',
    '• Embeddings use text-embedding-ada-002 with cosine similarity search',
    '• Results are filtered by `tenant_id` for strict isolation',
    '\n\nIs there a specific aspect you\'d like me to dive deeper into?'
  ]
};

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState('1');
  const [streamingContent, setStreamingContent] = useState('');
  const [showNewSession, setShowNewSession] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Auto-focus input
  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  const streamResponse = useCallback(async (responseParts: string[]) => {
    setIsLoading(true);
    setStreamingContent('');
    
    for (const part of responseParts) {
      // Simulate streaming by revealing text character by character
      let currentText = '';
      for (let i = 0; i < part.length; i++) {
        currentText += part[i];
        setStreamingContent(prev => {
          // Keep previous parts + current accumulating part
          const prevParts = prev.split('\n').slice(0, -1).join('\n');
          return prevParts ? prevParts + '\n' + currentText : currentText;
        });
        await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 20));
      }
      setStreamingContent(prev => prev + '\n');
    }
    
    const fullResponse = responseParts.join('\n');
    const assistantMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: fullResponse,
      timestamp: new Date(),
      sources: [
        { title: 'DevPilot Architecture Docs', relevance: 92 },
        { title: 'Authentication Best Practices', relevance: 87 },
      ],
    };
    setMessages(prev => [...prev, assistantMsg]);
    setStreamingContent('');
    setIsLoading(false);
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    const query = input;
    setInput('');

    // Determine which response to use
    const lower = query.toLowerCase();
    let responseKey = 'default';
    if (lower.includes('refactor') || lower.includes('auth')) responseKey = 'refactor';
    else if (lower.includes('debug') || lower.includes('timeout') || lower.includes('error')) responseKey = 'debug';
    
    await streamResponse(streamingResponses[responseKey]);
  }, [input, isLoading, streamResponse]);

  const handleNewSession = () => {
    const title = newSessionTitle.trim() || `Chat Session ${sessions.length + 1}`;
    const newSession: Session = {
      id: String(Date.now()),
      title,
      createdAt: 'Just now',
      messageCount: 0,
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSession(newSession.id);
    setMessages([]);
    setShowNewSession(false);
    setNewSessionTitle('');
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSession === id) {
      setActiveSession(sessions[0]?.id || '');
      setMessages([]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar - Sessions */}
      <div className="w-64 card flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-white text-sm">Chat Sessions</h2>
          <button
            onClick={() => setShowNewSession(true)}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800 transition-colors"
            title="New session"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {sessions.map((session) => (
            <div key={session.id} className="group relative">
              <button
                onClick={() => { setActiveSession(session.id); }}
                className={`w-full text-left px-3 py-2.5 rounded text-sm transition-all flex items-center gap-2 ${
                  activeSession === session.id
                    ? 'bg-teal-600/15 text-teal-400 border border-teal-600/20'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'
                }`}
              >
                <MessageSquare size={14} className="flex-shrink-0" />
                <span className="truncate flex-1">{session.title}</span>
                <span className="text-[10px] text-gray-600">{session.messageCount}</span>
              </button>
              <button
                onClick={(e) => handleDeleteSession(session.id, e)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                title="Delete session"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 card flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !streamingContent ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center max-w-md">
                <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500/20 to-indigo-600/20 border border-teal-500/10 flex items-center justify-center mb-4">
                  <Bot size={32} className="text-teal-400" />
                </div>
                <p className="text-lg font-medium text-gray-300">Start a conversation</p>
                <p className="text-sm mt-1 text-gray-500">
                  Ask DevPilot about your services, code, documentation, or any development questions.
                  The assistant uses RAG to search your knowledge base.
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {['Refactor auth flow', 'Debug API timeout', 'Schema design', 'Optimize RAG'].map((hint) => (
                    <button
                      key={hint}
                      onClick={() => { setInput(hint); inputRef.current?.focus(); }}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-md transition-colors border border-gray-700"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-glow-primary">
                      <Bot size={16} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-lg px-4 py-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white rounded-br-sm'
                      : 'bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700/50'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-700/50">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Sources</p>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((source, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-700/50 rounded text-[10px] text-gray-400">
                              <Sparkles size={10} className="text-teal-400" />
                              {source.title}
                              <span className="text-gray-600">{source.relevance}%</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
              {streamingContent && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-gray-800 rounded-lg rounded-bl-sm px-4 py-3 text-sm text-gray-100 border border-gray-700/50">
                    <p className="whitespace-pre-wrap">{streamingContent}</p>
                    <span className="inline-flex gap-0.5 ml-0.5">
                      <span className="w-1.5 h-3 bg-teal-400 rounded-sm animate-pulse" />
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask DevPilot anything..."
              className="input flex-1"
              disabled={isLoading}
            />
            <button
              className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <span className="inline-flex gap-0.5">
                  <span className="w-1 h-3 bg-white rounded-sm animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-3 bg-white rounded-sm animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-3 bg-white rounded-sm animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          <p className="text-[10px] text-gray-600 mt-2 flex items-center gap-1">
            <Sparkles size={10} />
            DevPilot uses RAG to search your documents. Verify important information.
          </p>
        </div>
      </div>

      {/* New Session Modal */}
      <Modal
        isOpen={showNewSession}
        onClose={() => setShowNewSession(false)}
        title="New Chat Session"
        description="Give your session a name"
        size="sm"
        footer={
          <>
            <button onClick={() => setShowNewSession(false)} className="btn-ghost text-sm">Cancel</button>
            <button onClick={handleNewSession} className="btn-primary text-sm">Create Session</button>
          </>
        }
      >
        <input
          type="text"
          value={newSessionTitle}
          onChange={e => setNewSessionTitle(e.target.value)}
          className="input"
          placeholder="e.g. Debug deployment issue"
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter') handleNewSession(); }}
        />
      </Modal>
    </div>
  );
}