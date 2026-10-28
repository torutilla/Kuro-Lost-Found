import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowBack,
  ChatBubbleOutline,
  Circle,
  ErrorOutline,
  InfoOutlined,
  Pets,
  Send,
} from "@mui/icons-material";
import Button from "@shared/components/common/Button.tsx";
import EmptyState from "@shared/components/common/EmptyState.tsx";
import LoadingScreen from "@shared/components/layout/LoadingScreen.tsx";
import { useAuth } from "@features/auth/hooks/useAuth.tsx";
import { useSocket } from "@shared/context/IOSocketProvider.tsx";
import useSocketEvent from "@shared/hooks/useSocketEvent.tsx";
import { useToast } from "@shared/hooks/useToast.tsx";
import { useGsapContext } from "@shared/hooks/useGsap.tsx";
import {
  messagingApi,
  type Conversation,
  type Message,
} from "../services/messagingApi.ts";

const CLOSED_STATUSES = new Set(["reunited", "archived"]);

function formatMessageTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
}

function formatDayLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === today.getFullYear() ? undefined : "numeric",
  }).format(date);
}

function MessagePage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const socket = useSocket();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const root = useGsapContext<HTMLDivElement>(({ gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".thread-back", { x: -12, opacity: 0, duration: 0.45 })
      .from(".thread-shell", { y: 24, opacity: 0, duration: 0.65 }, "-=0.2")
      .from(".thread-composer", { y: 14, opacity: 0, duration: 0.45 }, "-=0.25");
  }, [conversationId]);

  const isClosed = Boolean(conversation && CLOSED_STATUSES.has(conversation.pet_status));
  const otherParticipant = useMemo(
    () => conversation?.participants?.find((participant) => participant.user_id !== user?.id),
    [conversation, user?.id],
  );

  const addMessage = (nextMessage: Message) => {
    setMessages((current) => {
      const index = current.findIndex((message) => message.id === nextMessage.id);
      if (index >= 0) {
        const updated = [...current];
        updated[index] = { ...updated[index], ...nextMessage };
        return updated;
      }
      return [...current, nextMessage].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    });
  };

  useEffect(() => {
    if (!conversationId) return;
    const activeConversationId = conversationId;
    let cancelled = false;

    async function loadThread() {
      try {
        setLoading(true);
        setError(null);
        const [thread, result] = await Promise.all([
          messagingApi.getConversation(activeConversationId),
          messagingApi.getMessages(activeConversationId),
        ]);
        if (cancelled) return;
        setConversation(thread);
        setMessages([...result.messages].reverse());
        await messagingApi.markMessagesRead(activeConversationId);
      } catch (reason) {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : "Unable to load this conversation.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadThread();
    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || !socket) return;
    const messagingSocket = socket as unknown as {
      emit: (event: string, data: { conversationId: string }) => void;
    };
    messagingSocket.emit("join_conversation", { conversationId });
    return () => {
      messagingSocket.emit("leave_conversation", { conversationId });
    };
  }, [conversationId, socket]);

  useSocketEvent({
    event: "message:received",
    callback: (message) => {
      if (message.conversation_id !== conversationId) return;
      addMessage({ ...message, read_at: null });
      if (message.sender_id !== user?.id && conversationId) {
        void messagingApi.markMessagesRead(conversationId);
      }
    },
  });

  useSocketEvent({
    event: "messages:read",
    callback: ({ conversationId: readConversationId, readerId }) => {
      if (readConversationId !== conversationId || readerId === user?.id) return;
      setMessages((current) => current.map((message) =>
        message.sender_id === user?.id && !message.read_at
          ? { ...message, read_at: new Date().toISOString() }
          : message,
      ));
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = draft.trim();
    if (!conversationId || !body || sending || isClosed) return;

    try {
      setSending(true);
      const created = await messagingApi.sendMessage(conversationId, body);
      addMessage({ ...created, sender_name: user?.name ?? "You", read_at: null });
      setDraft("");
    } catch (reason) {
      showToast(reason instanceof Error ? reason.message : "Message could not be sent.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingScreen />;

  if (!conversation || error) {
    return (
      <EmptyState
        icon={ErrorOutline}
        title="Conversation unavailable"
        description={error ?? "This conversation could not be found."}
        action={<Link to="/inbox"><Button variant="outline" className="gap-2"><ArrowBack fontSize="small" />Back to messages</Button></Link>}
      />
    );
  }

  return (
    <div ref={root} className="mx-auto flex h-full w-full max-w-5xl flex-col px-4 py-6 lg:px-10 lg:py-10">
      <button className="thread-back link-underline mb-4 inline-flex w-fit items-center gap-1.5 text-sm text-accent transition-colors hover:text-primary" onClick={() => navigate("/inbox")}>
        <ArrowBack fontSize="small" /> All messages
      </button>

      <section className="thread-shell flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_24px_60px_-36px_rgba(27,38,59,0.45)]">
        <header className="relative flex items-center justify-between gap-4 border-b border-neutral-100 bg-card/60 px-5 py-4 sm:px-6">
          <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10"><Pets fontSize="small" /></div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-secondary">{conversation.pet_name}</p>
              <p className="truncate text-xs text-neutral-500">
                {otherParticipant ? `With ${otherParticipant.name}` : "Report conversation"}<span className="mx-1.5 text-neutral-300">•</span>{conversation.pet_status} report
              </p>
            </div>
          </div>
          {isClosed ? <span className="rounded-full bg-neutral-200 px-3 py-1 text-[0.68rem] font-medium tracking-wide text-neutral-600 uppercase">Closed</span> : <span className="hidden items-center gap-1.5 text-xs text-success sm:flex"><Circle sx={{ fontSize: 8 }} />Live conversation</span>}
        </header>

        <div className="flex-1 overflow-y-auto bg-[linear-gradient(135deg,rgba(30,58,138,0.025)_1px,transparent_1px)] bg-size-[22px_22px] px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary"><ChatBubbleOutline /></span>
              <h2 className="mt-4 text-xl font-semibold text-secondary">Start the conversation</h2>
              <p className="mt-1 max-w-sm text-sm leading-relaxed text-neutral-500">Share a helpful sighting, ask a question, or let them know you can help.</p>
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-3">
              {messages.map((message, index) => {
                const previous = messages[index - 1];
                const showDay = !previous || new Date(previous.created_at).toDateString() !== new Date(message.created_at).toDateString();
                const isMine = message.sender_id === user?.id;
                return <div key={message.id}>
                  {showDay && <div className="my-5 flex items-center gap-3 text-[0.65rem] font-medium tracking-[0.14em] text-neutral-400 uppercase"><span className="h-px flex-1 bg-neutral-200" />{formatDayLabel(message.created_at)}<span className="h-px flex-1 bg-neutral-200" /></div>}
                  <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <article className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[72%] ${isMine ? "rounded-br-md bg-primary text-white shadow-primary/15" : "rounded-bl-md border border-neutral-200 bg-white text-secondary"}`}>
                      {!isMine && <p className="mb-1 text-xs font-semibold text-accent">{message.sender_name}</p>}
                      <p className="whitespace-pre-wrap break-words leading-relaxed">{message.body}</p>
                      <p className={`mt-1.5 text-right text-[0.65rem] ${isMine ? "text-white/55" : "text-neutral-400"}`}>{formatMessageTime(message.created_at)}{isMine && message.read_at ? " · Seen" : ""}</p>
                    </article>
                  </div>
                </div>;
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {isClosed ? (
          <div className="thread-composer flex items-center gap-3 border-t border-neutral-100 bg-neutral-50 px-5 py-4 text-sm text-neutral-500 sm:px-6"><InfoOutlined className="shrink-0 text-accent" fontSize="small" />This report is closed, so this conversation is now read-only.</div>
        ) : (
          <form className="thread-composer border-t border-neutral-100 bg-white p-3 sm:p-4" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="message-body">Message</label>
            <div className="flex items-end gap-2 rounded-2xl border border-neutral-200 bg-card p-2 transition-shadow focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
              <textarea id="message-body" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={1} maxLength={2000} placeholder="Write a helpful message…" className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-relaxed text-secondary outline-none placeholder:text-neutral-400" />
              <Button type="submit" disabled={!draft.trim() || sending} aria-label="Send message" className="h-10 w-10 rounded-xl p-0"><Send fontSize="small" /></Button>
            </div>
            <p className="px-2 pt-2 text-right text-[0.65rem] text-neutral-400">{draft.length}/2000 · Enter to send</p>
          </form>
        )}
      </section>
    </div>
  );
}

export default MessagePage;
