"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import ChatMessageContent from "@/components/dashboard/ChatMessageContent";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessFullApp } from "@/lib/access";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_PROMPTS = [
  "Explain annuities in simple terms",
  "What's the difference between term and whole life?",
  "Help me understand Medicare Part B",
];

export default function AITutorChat() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasAccess = canAccessFullApp(user);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    if (open) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [open, messages, scrollToBottom]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setSending(true);

    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message as string },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  if (loading || !hasAccess) return null;

  return (
    <div className="pointer-events-none fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-[60] flex flex-col items-end gap-3 lg:bottom-6">
      {open && (
        <div
          className="pointer-events-auto flex w-[min(100vw-2rem,24rem)] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl sm:w-96"
          role="dialog"
          aria-label="AI exam tutor"
        >
          <div className="flex items-center justify-between border-b border-stone-200 bg-md-black px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">AI Exam Tutor</p>
              <p className="text-xs text-white/70">
                Maryland Life &amp; Health prep
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 hover:bg-white/10"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            ref={listRef}
            className="flex max-h-[min(50vh,22rem)] flex-col gap-3 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-stone-600">
                  Ask anything about Maryland insurance exam topics. I can use
                  your recent practice results to personalize help.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt)}
                      disabled={sending}
                      className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-left text-xs font-medium text-stone-700 hover:border-md-red/30 hover:bg-md-red-light/40 disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`max-w-[90%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "ml-auto bg-md-red text-white"
                    : "mr-auto border border-stone-200 bg-stone-50 text-stone-800"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <ChatMessageContent content={msg.content} />
                )}
              </div>
            ))}

            {sending && (
              <p className="text-shimmer text-sm font-medium">Thinking…</p>
            )}

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {error}
              </p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 border-t border-stone-200 px-3 py-3"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage(input);
                }
              }}
              rows={2}
              placeholder="Ask a question…"
              disabled={sending}
              className="min-h-[2.5rem] flex-1 resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-md-red focus:outline-none focus:ring-1 focus:ring-md-red disabled:bg-stone-50"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="btn-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg p-0 disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-md-white bg-md-red text-white shadow-lg shadow-md-red/30 transition-transform hover:scale-105 hover:bg-md-red-dark"
        aria-label={open ? "Close AI tutor" : "Open AI tutor"}
        aria-expanded={open}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <Sparkles className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
