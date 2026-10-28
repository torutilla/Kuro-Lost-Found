import { Link } from "react-router-dom";
import EmptyState from "@shared/components/common/EmptyState.tsx";
import Button from "@shared/components/common/Button.tsx";
import { useGsapContext } from "@shared/hooks/useGsap.tsx";
import { ArrowForward, ChatBubbleOutline } from "@mui/icons-material";
import { messagingApi } from "../services/messagingApi.ts";
import type { Conversation } from "../services/messagingApi.ts";
import { useEffect, useState } from "react";

function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ref = useGsapContext<HTMLDivElement>(({ gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".inbox-head > *", { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 })
      .from(".inbox-body", { y: 24, opacity: 0, duration: 0.6 }, "-=0.3");
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadConversations() {
      try {
        setLoading(true);
        setError(null);
        const data = await messagingApi.listConversations();
        if (!cancelled) setConversations(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load conversations");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadConversations();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-10 lg:py-12 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={ChatBubbleOutline}
        title="Unable to load messages"
        description={error}
        action={
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (conversations.length === 0) {
    return (
      <div
        ref={ref}
        className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-10 lg:py-12"
      >
        <header className="inbox-head mb-6">
          <h1 className="text-3xl font-semibold text-secondary">Messages</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Conversations with people near your reports.
          </p>
        </header>
        <div className="inbox-body overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <EmptyState
            icon={ChatBubbleOutline}
            title="No messages yet"
            description="When someone finds your pet or replies to a report, the conversation will appear here."
            action={
              <Link to="/home">
                <Button className="group gap-2">
                  Browse the map
                  <ArrowForward
                    fontSize="small"
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-10 lg:py-12"
    >
      <header className="inbox-head mb-6">
        <h1 className="text-3xl font-semibold text-secondary">Messages</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Conversations with people near your reports.
        </p>
      </header>

      <div className="inbox-body overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="text-sm font-medium text-secondary">Conversations</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              to={`/inbox/${conv.id}`}
              className="block p-4 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-medium text-sm">
                      {conv.pet_name.charAt(0)}
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-secondary truncate w-48">
                      {conv.pet_name}
                    </h3>
                    <p className="text-xs text-neutral-500 truncate w-48">
                      {conv.pet_status.charAt(0).toUpperCase() + conv.pet_status.slice(1)} report
                    </p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  {conv.latest_message ? (
                    <>
                      <p className="text-xs font-medium text-secondary truncate w-32">
                        {conv.latest_message.sender_name}
                      </p>
                      <p className="text-xs text-neutral-500 truncate w-32">
                        {conv.latest_message.body}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-neutral-400">No messages yet</p>
                  )}
                </div>
              </div>
              {conv.unread_count > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-medium">
                  {conv.unread_count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InboxPage;
