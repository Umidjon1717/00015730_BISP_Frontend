import { useState, useRef, useEffect } from "react";
import { aiChat, AiMessage } from "@/utils/ai-api";
import { BsChatDots, BsX, BsSendFill } from "react-icons/bs";

const AiChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const updated: AiMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await aiChat(updated);
      setMessages([...updated, { role: "assistant", content: res.message }]);
    } catch {
      setError("Failed to get a response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="w-[360px] max-[500px]:w-[calc(100vw-2.5rem)] bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-zinc-700 overflow-hidden"
          style={{ height: "480px" }}
        >
          {/* Header */}
          <div className="bg-bg-primary px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-white font-semibold text-sm">AI Furniture Assistant</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <BsX className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 dark:text-gray-500 text-sm pt-8 select-none">
                <div className="text-3xl mb-3">👋</div>
                <p className="font-medium text-gray-600 dark:text-gray-400">Hi! I can help you find the perfect furniture.</p>
                <p className="mt-2 text-xs text-gray-400">
                  Try: <em>"I need a sofa for a small living room"</em>
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-bg-primary text-white rounded-br-sm"
                      : "bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-zinc-700 rounded-2xl rounded-bl-sm px-4 py-3">
                  <span className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:160ms]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:320ms]" />
                  </span>
                </div>
              </div>
            )}

            {error && (
              <p className="text-center text-xs text-red-500 dark:text-red-400">{error}</p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-zinc-700 p-3 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about furniture..."
              className="flex-1 text-sm rounded-full border border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-900 dark:text-white px-4 py-2 focus:outline-none focus:border-bg-primary transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="w-9 h-9 shrink-0 bg-bg-primary rounded-full flex items-center justify-center hover:bg-amber-600 disabled:opacity-40 transition-colors"
            >
              <BsSendFill className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
        className="w-14 h-14 bg-bg-primary rounded-full shadow-lg flex items-center justify-center hover:bg-amber-600 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {open ? (
          <BsX className="w-7 h-7 text-white" />
        ) : (
          <BsChatDots className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
};

export default AiChat;
