import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowBigUp, ArrowLeft, Bookmark, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { posts } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/community/$postId")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.id === params.postId);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Post unavailable" }, { name: "robots", content: "noindex" }] };
    const { post } = loaderData;
    const desc = post.body.slice(0, 150);
    return {
      meta: [
        { title: `${post.author} on ${post.tags[0] ?? "fusion"} — Fusion Connect AI` },
        { name: "description", content: desc },
        { property: "og:title", content: `${post.author} — Fusion Connect AI` },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: PostDetail,
});

function PostDetail() {
  const { post } = Route.useLoaderData();
  const { upvoted, saved, toggleUpvote, toggleSave, anonId } = useAppState();
  const [comments, setComments] = useState(post.comments);
  const [draft, setDraft] = useState("");
  const up = upvoted.includes(post.id);
  const sv = saved.includes(post.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to feed
      </Link>

      <article className="mt-8">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full border border-primary/30 font-mono text-xs text-primary">
            {post.author.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{post.author}</p>
            <p className="font-mono text-xs text-muted-foreground">
              {post.handle} · {post.affiliation} · {post.time}
            </p>
          </div>
        </div>
        <p className="mt-6 text-lg leading-relaxed">{post.body}</p>
        <p className="mt-4 flex gap-2 font-mono text-xs text-primary">
          {post.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-2 border-y border-border py-3">
          <Button variant="ghost" size="sm" onClick={() => toggleUpvote(post.id)} className={up ? "text-primary" : ""}>
            <ArrowBigUp className="size-4" /> {post.upvotes + (up ? 1 : 0)} upvotes
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toggleSave(post.id)} className={sv ? "text-primary" : ""}>
            <Bookmark className="size-4" /> {sv ? "Saved" : "Save"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toast.success("Link copied")}>
            <Share2 className="size-4" /> Share
          </Button>
        </div>
      </article>

      <section className="mt-8">
        <p className="eyebrow">{comments.length} replies</p>
        <div className="mt-4 hairline rounded-lg bg-card p-5">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a reply…"
            className="min-h-20 resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
          />
          <div className="mt-3 flex justify-end border-t border-border pt-3">
            <Button
              size="sm"
              disabled={!draft.trim()}
              onClick={() => {
                setComments((c) => [...c, { author: "You (anonymous)", handle: anonId, body: draft.trim(), time: "now" }]);
                setDraft("");
                toast.success("Reply posted");
              }}
            >
              Reply
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {comments.map((c, i) => (
            <div key={`${c.handle}-${i}`} className="hairline rounded-lg p-5">
              <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
                <span className="font-semibold">{c.author}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {c.handle} · {c.time}
                </span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
