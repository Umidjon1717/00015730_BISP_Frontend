const AI_BASE = "https://zero0015730-bisp-backend.onrender.com/api";

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiChatResponse {
  message: string;
  usage?: unknown;
}

export interface AiProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  colors?: string[];
  tags?: string[];
  stock?: number;
  images?: string[];
  discount?: { percent: number };
}

export interface GenerateRoomRequest {
  roomName: string;
  width: number;
  length: number;
  style?: string;
  budget?: number;
}

export interface GenerateRoomResponse {
  imageUrl: string;
  roomName: string;
  dimensions: string;
  style: string;
  selectedProducts: AiProduct[];
  layoutDescription: string;
  totalEstimate: number;
}

export interface AiSearchResponse {
  products: AiProduct[];
  explanation: string;
  query: string;
}

export interface AiRecommendResponse {
  currentProduct: AiProduct;
  recommendations: AiProduct[];
  reason: string;
}

export interface AiRoomStyleResponse {
  suggestions: AiProduct[];
  designTips: string;
  totalEstimate: number;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${AI_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`AI request failed: ${res.status}`);
  }
  return res.json();
}

export function aiChat(messages: AiMessage[], categoryFilter?: string): Promise<AiChatResponse> {
  const body: Record<string, unknown> = { messages };
  if (categoryFilter) body.categoryFilter = categoryFilter;
  return post("/ai/chat", body);
}

export function aiSearch(query: string): Promise<AiSearchResponse> {
  return post("/ai/search", { query });
}

export function aiRecommend(productId: number): Promise<AiRecommendResponse> {
  return post("/ai/recommend", { productId });
}

export function aiRoomStyle(description: string, budget?: number): Promise<AiRoomStyleResponse> {
  const body: Record<string, unknown> = { description };
  if (budget !== undefined && budget > 0) body.budget = budget;
  return post("/ai/room-style", body);
}

export function aiGenerateRoom(req: GenerateRoomRequest): Promise<GenerateRoomResponse> {
  const body: Record<string, unknown> = {
    roomName: req.roomName,
    width: req.width,
    length: req.length,
  };
  if (req.style?.trim()) body.style = req.style.trim();
  if (req.budget && req.budget > 0) body.budget = req.budget;
  return post("/ai/generate-room", body);
}
