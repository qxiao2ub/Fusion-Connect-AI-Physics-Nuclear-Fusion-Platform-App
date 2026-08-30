import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowBigUp, Bookmark, MessageSquare, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { posts as seedPosts, topics, type Post } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/community/")({
  head: () => ({
    meta: [
      { title: "Community — Fusion & Plasma Physics Feed | Fusion Connect AI" },
      { name: "description", content: "A focused science feed: results, questions and debate on fusion and plasma physics." },
      { property: "og:title", content: "The Fusion Connect AI community feed" },
      { property: "og:description", content: "Posts, comments and upvotes from researchers, students and teachers." },
    ],
  }),
  component: Community,
});

function Community() {
  const { upvoted, saved, toggleUpvote, toggleSave, anonId } = useAppState();
  const [extra, setExtra] = useState<Post[]>([]);
  const [draft, setDraft] = useState("");
  const [tag, setTag] = useState("All");
  const [q, setQ] = useState("");

  const all = [...extra, ...seedPosts];
  const list = useMemo(
    () =>
      all.filter(
        (p) =>
          (tag === "All" || p.tags.includes(tag)) &&
          (q.trim() === "" || p.body.toLowerCase().includes(q.trim().toLowerCase())),
      ),
    [all, tag, q],
  );

  const publish = () => {
    if (!draft.trim()) return;
    setExtra((s) => [
      {
        id: `new-${s.length}`,
        author: "You (anonymous)",
        handle: anonId,
        affiliation: "Anonymous learner",
        time: "now",
        body: draft.trim(),
        tags: tag === "All" ? ["#Fusion"] : [tag],
        upvotes: 0,
        comments: [],
      },
      ...s,
    ]);
    setDraft("");
    toast.success("Posted to the feed");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="eyebrow">Discussion</p>
      <h1 className="mt-3 text-4xl font-semibold">Community</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0">
          <div className="hairline rounded-lg bg-card p-5">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Share a result, ask a question, or challenge a model…"
              className="min-h-24 resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
            />
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-mono text-xs text-muted-foreground">{tag === "All" ? "#Fusion" : tag}</span>
              <Button size="sm" onClick={publish} disabled={!draft.trim()}>
                Post
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {["All", ...topics].map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${
                  tag === t ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search feed…" className="ml-auto w-full sm:w-52" />
          </div>

          <div className="mt-6 divide-y divide-border border-y border-border">
            {list.map((p) => {
              const up = upvoted.includes(p.id);
              const sv = saved.includes(p.id);
              return (
                <article key={p.id} className="py-6">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/30 font-mono text-xs text-primary">
                      {p.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
                        <span className="font-semibold">{p.author}</span>
                        <span className="font-mono text-xs text-muted-foreground">{p.handle}</span>
                        <span className="font-mono text-xs text-muted-foreground">· {p.time}</span>
                      </p>
                      <p className="eyebrow mt-0.5">{p.affiliation}</p>
                      <Link to="/community/$postId" params={{ postId: p.id }} className="mt-3 block text-[15px] leading-relaxed">
                        {p.body}
                      </Link>
                      <p className="mt-3 flex flex-wrap gap-2 font-mono text-xs text-primary">
                        {p.tags.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-muted-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleUpvote(p.id)}
                          className={up ? "text-primary" : ""}
                        >
                          <ArrowBigUp className="size-4" /> {p.upvotes + (up ? 1 : 0)}
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/community/$postId" params={{ postId: p.id }}>
                            <MessageSquare className="size-4" /> {p.comments.length}
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toggleSave(p.id);
                            toast(sv ? "Removed from saved" : "Saved to your library");
                          }}
                          className={sv ? "text-primary" : ""}
                        >
                          <Bookmark className="size-4" /> {sv ? "Saved" : "Save"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toast.success("Link copied")}>
                          <Share2 className="size-4" /> Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {list.length === 0 && <p className="py-16 text-center text-sm text-muted-foreground">Nothing here yet.</p>}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="hairline rounded-lg p-5">
            <p className="eyebrow">Trending topics</p>
            <ul className="mt-4 space-y-3">
              {topics.map((t, i) => (
                <li key={t} className="flex items-center justify-between text-sm">
                  <button onClick={() => setTag(t)} className="font-mono text-primary hover:underline">
                    {t}
                  </button>
                  <span className="font-mono text-xs text-muted-foreground">{[412, 388, 264, 191, 140, 96][i]}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hairline rounded-lg p-5">
            <p className="eyebrow">Community norms</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Cite what you can. Say when you're unsure. Assume the student reading this is smarter than you.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
