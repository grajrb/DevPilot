// AI/LLM service types (FastAPI backend)

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  user?: string; // userId for tracking
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface ChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  tenantId: string;
  userId?: string;
  sessionId?: string;
  traceId?: string;
}

export interface ChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: {
    index: number;
    delta: Partial<ChatMessage>;
    finish_reason: string | null;
  }[];
  tenantId: string;
}

// Embedding types
export interface EmbeddingRequest {
  model: string;
  input: string | string[];
  encoding_format?: 'float' | 'base64';
  dimensions?: number;
  user?: string;
}

export interface EmbeddingResponse {
  object: 'list' | 'embedding';
  data: Array<{
    index: number;
    object: 'embedding';
    embedding: number[];
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
  tenantId: string;
}

// Provider routing
export interface LLMProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'azure' | 'cohere' | 'ollama' | 'custom';
  config: ProviderConfig;
  isActive: boolean;
  priority: number;
  rateLimitRpm?: number;
}

export interface ProviderConfig {
  apiKey?: string;
  baseUrl: string;
  defaultModel: string;
  models: string[];
  timeout: number;
  maxRetries: number;
  headers?: Record<string, string>;
}

export interface LLMRequest {
  providerId: string;
  model: string;
  messages: ChatMessage[];
  parameters: {
    temperature: number;
    top_p: number;
    max_tokens: number;
    stream: boolean;
  };
  tenantId: string;
  userId?: string;
  sessionId?: string;
}

export interface LLMResponse {
  id: string;
  content: string;
  model: string;
  provider: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latency: number;
  cost: number;
  traceId?: string;
}

// Evaluation types (AI-specific)
export interface EvaluationTask {
  id: string;
  tenantId: string;
  evaluationId: string;
  examples: EvaluationExample[];
  model: string;
  metrics: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: {
    total: number;
    completed: number;
    failed: number;
  };
  startedAt: Date;
  finishedAt?: Date;
}

export interface EvaluationExample {
  id: string;
  input: string;
  expected?: string;
  context?: string;
  metadata?: Record<string, any>;
}

// Cost tracking
export interface CostBreakdown {
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  promptCost: number;
  completionCost: number;
  totalCost: number;
}

export interface UsageStats {
  tenantId: string;
  userId?: string;
  date: string;
  totalCalls: number;
  totalTokens: number;
  totalCost: number;
  breakdown: CostBreakdown[];
}

// Guardrail results
export interface GuardrailResult {
  passed: boolean;
  violations: GuardrailViolation[];
  modifiedInput?: string;
  modifiedOutput?: string;
}

export interface GuardrailViolation {
  type: 'pii' | 'toxicity' | 'prompt_injection' | 'content_policy' | 'custom';
  severity: 'low' | 'medium' | 'high';
  description: string;
  location: 'input' | 'output';
  entity?: string;
}

// RAG types
export interface Document {
  id: string;
  tenantId: string;
  collectionId: string;
  content: string;
  embedding?: number[];
  metadata: Record<string, any>;
  chunkCount: number;
  createdAt: Date;
}

export interface RetrievalResult {
  documents: Array<{
    document: Document;
    score: number;
  }>;
  query: string;
  retrievalLatency: number;
}

export interface RAGGenerationRequest {
  query: string;
  collectionId: string;
  model: string;
  topK?: number;
  rerank?: boolean;
  temperature?: number;
}

export interface RAGGenerationResponse {
  answer: string;
  sources: Array<{
    documentId: string;
    content: string;
    score: number;
  }>;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latency: number;
}
