import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { proposals, type Proposal } from "@/lib/mock-data";

export const Route = createFileRoute("/collaborate")({
  head: () => ({
    meta: [
      { title: "Collaborate — Research & Classroom Projects | Fusion Connect AI" },
      { name: "description", content: "Open fusion research proposals and classroom projects, with skills and team size stated up front." },
      { property: "og:title", content: "Collaborate on fusion projects" },
      { property: "og:description", content: "Research proposals and classroom projects looking for collaborators." },
    ],
  }),
  component: Collaborate,
});

const DIFFS = ["All", "Introductory", "Intermediate", "Advanced"] as const;

function Collaborate() {
  const [kind, setKind] = useState<"research" | "classroom">("research");
  const [diff, setDiff] = useState<string>("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Proposal | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const list = useMemo(
    () =>
      proposals.filter(
        (p) =>
          p.kind === kind &&
          (diff === "All" || p.difficulty === diff) &&
          (q.trim() === "" || (p.title + p.field + p.skills.join(" ")).toLowerCase().includes(q.trim().toLowerCase())),
      ),
    [kind, diff, q],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Working together</p>
          <h1 className="mt-3 text-4xl font-semibold">Collaborate</h1>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" /> New proposal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Create a proposal</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Title" />
              <Input placeholder="Field (e.g. Plasma control)" />
              <Input placeholder="Skills, comma separated" />
              <Input placeholder="Team size" />
              <Textarea placeholder="What are you trying to find out, and what does a collaborator do?" className="min-h-28" />
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  setCreateOpen(false);
                  toast.success("Proposal drafted (prototype — nothing was saved)");
                }}
              >
                Publish proposal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-y border-border py-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={kind} onValueChange={(v) => setKind(v as "research" | "classroom")}>
          <TabsList>
            <TabsTrigger value="research">Research Projects</TabsTrigger>
            <TabsTrigger value="classroom">Classroom Projects</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap items-center gap-2">
          {DIFFS.map((d) => (
            <Button key={d} size="sm" variant={diff === d ? "default" : "outline"} onClick={() => setDiff(d)} className="rounded-full">
              {d}
            </Button>
          ))}
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search proposals…" className="w-full sm:w-56" />
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <button
            key={p.id}
            onClick={() => setOpen(p)}
            className="hairline flex flex-col rounded-lg bg-card p-6 text-left transition-colors hover:border-primary/50"
          >
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase">
                {p.field}
              </Badge>
              <span className="font-mono text-[11px] text-muted-foreground">{p.difficulty}</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.skills.map((s) => (
                <span key={s} className="hairline rounded-full px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-5 flex items-center gap-2 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">
              <Users className="size-3" /> {p.team} · {p.spots} open · led by {p.lead}
            </p>
          </button>
        ))}
      </div>
      {list.length === 0 && <p className="mt-16 text-center text-sm text-muted-foreground">No proposals match those filters.</p>}

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{open.title}</DialogTitle>
              </DialogHeader>
              <p className="font-mono text-xs text-muted-foreground">
                {open.field} · {open.difficulty} · {open.team} · {open.spots} spots
              </p>
              <div className="space-y-4">
                {open.detail.map((d) => (
                  <p key={d.slice(0, 20)} className="text-sm leading-relaxed text-muted-foreground">
                    {d}
                  </p>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {open.skills.map((s) => (
                  <span key={s} className="hairline rounded-full px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => toast("Saved to your projects")}>
                  Save
                </Button>
                <Button onClick={() => toast.success("Request to join sent to " + open.lead)}>Request to join</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
