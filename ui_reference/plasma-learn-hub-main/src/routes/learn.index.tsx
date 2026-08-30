import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, Signal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { modules } from "@/lib/mock-data";

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "Learn — Physics & Nuclear Fusion Modules | Fusion Connect AI" },
      {
        name: "description",
        content: "Guided modules on plasma physics, magnetic confinement, tokamaks, stability and fusion materials.",
      },
      { property: "og:title", content: "Learn physics and nuclear fusion" },
      { property: "og:description", content: "Modules with equations, diagrams, progress and knowledge checks." },
    ],
  }),
  component: LearnIndex,
});

const difficulties = ["All", "Introductory", "Intermediate", "Advanced"] as const;

function LearnIndex() {
  const [tab, setTab] = useState("All");
  const [diff, setDiff] = useState<string>("All");
  const [q, setQ] = useState("");

  const list = useMemo(
    () =>
      modules.filter(
        (m) =>
          (tab === "All" || m.category === tab) &&
          (diff === "All" || m.difficulty === diff) &&
          (q.trim() === "" ||
            (m.title + m.summary + m.topics.join(" ")).toLowerCase().includes(q.trim().toLowerCase())),
      ),
    [tab, diff, q],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="eyebrow">Curriculum</p>
      <h1 className="mt-3 text-4xl font-semibold">Learn</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Two tracks that meet in the middle: the physics that governs ionised matter, and the engineering that turns it
        into energy.
      </p>

      <div className="mt-10 flex flex-col gap-4 border-y border-border py-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Physics">Physics</TabsTrigger>
            <TabsTrigger value="Nuclear Fusion">Nuclear Fusion</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap items-center gap-2">
          {difficulties.map((d) => (
            <Button
              key={d}
              size="sm"
              variant={diff === d ? "default" : "outline"}
              onClick={() => setDiff(d)}
              className="rounded-full"
            >
              {d}
            </Button>
          ))}
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter modules…"
            className="w-full sm:w-56"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((m) => (
          <Link
            key={m.slug}
            to="/learn/$slug"
            params={{ slug: m.slug }}
            className="group hairline flex flex-col rounded-lg bg-card p-6 transition-all hover:border-primary/50 hover:shadow-[0_0_0_1px_var(--plasma)]"
          >
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase">
                {m.category}
              </Badge>
              <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                <Clock className="size-3" /> {m.minutes}m
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold group-hover:text-primary">{m.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{m.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {m.topics.map((t) => (
                <span key={t} className="hairline rounded-full px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Signal className="size-3" /> {m.difficulty}
                </span>
                <span>{m.progress}%</span>
              </div>
              <Progress value={m.progress} className="h-1" />
            </div>
          </Link>
        ))}
      </div>
      {list.length === 0 && (
        <p className="mt-16 text-center text-sm text-muted-foreground">No modules match those filters.</p>
      )}
    </div>
  );
}
