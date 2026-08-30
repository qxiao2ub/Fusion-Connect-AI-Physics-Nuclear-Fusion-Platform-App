import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ThumbsDown, ThumbsUp, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { recommendations } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/mentor")({
  head: () => ({
    meta: [
      { title: "AI Mentor — Transparent Learning Recommendations | Fusion Connect AI" },
      { name: "description", content: "Recommended modules, discussions and projects — with a plain explanation of why each was surfaced." },
      { property: "og:title", content: "Your AI Mentor" },
      { property: "og:description", content: "Personalised fusion learning paths with transparent reasoning." },
    ],
  }),
  component: Mentor,
});

const pipeline = [
  { step: "Signals", body: "Module progress, quiz outcomes, saved topics — all stored locally." },
  { step: "Supervised model", body: "Learns which next step historically led to completion for similar profiles." },
  { step: "Recommendation", body: "Ranks modules, threads and projects with a stated confidence." },
  { step: "Your feedback", body: "Helpful / not helpful votes label the outcome." },
  { step: "Reinforcement", body: "Policy updates weight future ranking toward what actually helped." },
];

function Mentor() {
  const { interests, level } = useAppState();
  const [voted, setVoted] = useState<Record<string, "up" | "down">>({});

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="eyebrow">Personalisation</p>
      <h1 className="mt-3 flex items-center gap-3 text-4xl font-semibold">
        AI Mentor <Sparkles className="size-6 text-primary" />
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Tuned for a <span className="text-foreground">{level.toLowerCase()}</span> interested in{" "}
        <span className="text-foreground">{interests.join(", ").toLowerCase()}</span>. Every suggestion states its
        reasoning — you can disagree with it.
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {recommendations.map((r) => (
          <div key={r.title} className="hairline flex flex-col rounded-lg bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="eyebrow">{r.type}</span>
              <span className="font-mono text-xs text-primary">{Math.round(r.confidence * 100)}%</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold">{r.title}</h2>
            <Progress value={r.confidence * 100} className="mt-3 h-1" />
            <div className="mt-5 rounded-md border border-primary/25 bg-primary/5 p-4">
              <p className="eyebrow">Why this was recommended</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.reason}</p>
            </div>
            <div className="mt-auto flex items-center gap-2 pt-6">
              <Button asChild size="sm">
                <Link to={r.href as "/learn"}>
                  Open <ArrowRight className="size-3.5" />
                </Link>
              </Button>
              <div className="ml-auto flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Helpful"
                  className={voted[r.title] === "up" ? "text-primary" : ""}
                  onClick={() => {
                    setVoted((v) => ({ ...v, [r.title]: "up" }));
                    toast.success("Signal recorded — future ranking updated");
                  }}
                >
                  <ThumbsUp className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Not helpful"
                  className={voted[r.title] === "down" ? "text-destructive" : ""}
                  onClick={() => {
                    setVoted((v) => ({ ...v, [r.title]: "down" }));
                    toast("Noted — we'll surface this less often");
                  }}
                >
                  <ThumbsDown className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-16 rounded-lg border border-border bg-card/40 p-8">
        <p className="eyebrow">Planned architecture · not yet implemented</p>
        <h2 className="mt-3 text-2xl font-semibold">How the recommender is designed to learn</h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-5">
          {pipeline.map((p, i) => (
            <div key={p.step} className="bg-background p-5">
              <p className="font-mono text-xs text-primary">0{i + 1}</p>
              <h3 className="mt-3 text-sm font-semibold">{p.step}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 900 60" className="mt-6 w-full" aria-hidden="true">
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--plasma)" />
            </marker>
          </defs>
          <line x1="20" y1="30" x2="860" y2="30" stroke="var(--plasma)" strokeWidth="1" markerEnd="url(#arrow)" opacity="0.6" />
          <path d="M860 30 C880 60 40 70 20 34" fill="none" stroke="var(--plasma-deep)" strokeDasharray="4 4" strokeWidth="1" markerEnd="url(#arrow)" />
          <text x="440" y="56" fontSize="10" fontFamily="var(--font-mono)" fill="var(--color-muted-foreground)" textAnchor="middle">
            FEEDBACK LOOP
          </text>
        </svg>
        <p className="mt-6 max-w-2xl text-xs text-muted-foreground">
          This prototype contains no machine learning. Recommendations shown above are fixed mock data illustrating the
          intended interface and its explanations.
        </p>
      </section>
    </div>
  );
}
