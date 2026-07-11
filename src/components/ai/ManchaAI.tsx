import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, X, Send, Sparkles, Loader2, ArrowUpRight } from "lucide-react";
import { chatWithManchaAI } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Explore Shows",
  "Join Theatre",
  "Become Premium",
  "Funding",
  "Training",
  "History of Bangladeshi theatre",
];

const SUGGESTION_PROMPTS: Record<string, string> = {
  "Explore Shows": "Take me to the shows section",
  "Join Theatre": "How do I join a theatre group on Mancha?",
  "Become Premium": "How does premium membership work?",
  Funding: "Show me funding campaigns and how they work",
  Training: "Tell me about training programs on Mancha",
  "Community": "How does the Mancha community work?",
  "History of Bangladeshi theatre": "Give me a short history of theatre in Bangladesh",
};

// Extract [/path] link tokens from assistant text
function parseMessage(text: string): { clean: string; links: string[] } {
  const links: string[] = [];
  const clean = text.replace(/\[(\/[a-zA-Z0-9\-/_]*)\]/g, (_, p) => {
    if (!links.includes(p)) links.push(p);
    return "";
  }).replace(/\s{2,}/g, " ").trim();
  return { clean, links };
}

function labelForPath(p: string): string {
  const map: Record<string, string> = {
    "/explore/shows": "Explore Shows",
    "/explore/artists": "Explore Artists",
    "/explore/groups": "Theatre Groups",
    "/explore": "Explore",
    "/register": "Register",
    "/login": "Sign In",
    "/about": "About Mancha",
    "/contact": "Contact",
  };
  if (map[p]) return map[p];
  const last = p.split("/").filter(Boolean).pop() ?? p;
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ");
}

export function ManchaAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const send = useServerFn(chatWithManchaAI);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const submit = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await send({ data: { messages: next } });
      setMessages((m) => [...m, { role: "assistant", content: res.text }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "The AI assistant is temporarily unavailable." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Mancha AI" : "Open Mancha AI"}
        className={cn(
          "fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full",
          "bg-brand text-brand-foreground shadow-elevated transition-all hover:scale-105 hover:shadow-gold",
          "focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-accent-foreground">
            <Sparkles className="h-3 w-3" />
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Mancha AI chat"
          className={cn(
            "fixed z-[60] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevated animate-fade-in",
            "bottom-24 right-5 h-[70vh] max-h-[640px] w-[calc(100vw-2.5rem)] sm:w-[400px]",
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border bg-gradient-to-br from-brand to-brand/80 p-4 text-brand-foreground">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-foreground/15">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <div className="font-display text-base leading-tight">Mancha AI</div>
              <div className="text-[11px] opacity-80">Your theatre concierge</div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-background/60 p-4">
            {messages.length === 0 && (
              <div className="space-y-4 py-2">
                <p className="text-sm text-muted-foreground">
                  Hi! Ask me about Mancha, Bangladeshi theatre, or where to go next.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(SUGGESTION_PROMPTS[s] ?? s)}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition hover:border-brand hover:bg-brand/5"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => {
              if (m.role === "user") {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand px-3.5 py-2 text-sm text-brand-foreground">
                      {m.content}
                    </div>
                  </div>
                );
              }
              const { clean, links } = parseMessage(m.content);
              return (
                <div key={i} className="flex flex-col gap-2">
                  <div className="max-w-[90%] whitespace-pre-wrap rounded-2xl rounded-bl-sm border border-border bg-card px-3.5 py-2 text-sm text-foreground">
                    {clean}
                  </div>
                  {links.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {links.map((p) => (
                        <button
                          key={p}
                          onClick={() => {
                            setOpen(false);
                            navigate({ to: p });
                          }}
                          className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-medium text-accent-foreground transition hover:bg-accent/25"
                        >
                          {labelForPath(p)}
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Mancha AI is thinking…
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="flex items-end gap-2 border-t border-border bg-card p-3"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              rows={1}
              placeholder="Ask about shows, groups, tickets…"
              aria-label="Message Mancha AI"
              className="max-h-32 min-h-10 flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="h-10 w-10 shrink-0 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
