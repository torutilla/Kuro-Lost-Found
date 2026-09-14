import { Link } from "react-router-dom";
import EmptyState from "@shared/components/common/EmptyState.tsx";
import Button from "@shared/components/common/Button.tsx";
import { useGsapContext } from "@shared/hooks/useGsap.tsx";
import { ArrowForward, ChatBubbleOutline } from "@mui/icons-material";

function InboxPage() {
  const ref = useGsapContext<HTMLDivElement>(({ gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".inbox-head > *", { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 })
      .from(".inbox-body", { y: 24, opacity: 0, duration: 0.6 }, "-=0.3");
  }, []);

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

export default InboxPage;
