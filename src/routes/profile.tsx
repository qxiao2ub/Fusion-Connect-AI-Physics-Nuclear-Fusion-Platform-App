import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, EyeOff, BarChart3, Fingerprint } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { modules, posts } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Anonymous Learner | Fusion Connect AI" },
      { name: "description", content: "Your anonymous identity, interests, learning progress, saved resources and community activity." },
      { property: "og:title", content: "Your anonymous profile" },
      { property: "og:description", content: "Public profile, private learning data and anonymised analytics, kept separate." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { anonId, interests, level, saved, upvoted } = useAppState();
  const completed = modules.filter((m) => m.progress === 100);
  const savedPosts = posts.filter((p) => saved.includes(p.id));

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex size-16 items-center justify-center rounded-full border border-primary/40">
          <Fingerprint className="size-6 text-primary" />
        </div>
        <div>
          <p className="eyebrow">Anonymous identity</p>
          <h1 className="mt-1 font-mono text-2xl">{anonId}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{level}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {interests.map((i) => (
          <Badge key={i} variant="outline" className="rounded-full">
            {i}
          </Badge>
        ))}
        <Link to="/onboarding" className="rounded-full border border-primary/40 px-3 py-1 text-xs text-primary">
          Edit interests
        </Link>
      </div>

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-3">
        <section className="bg-card p-6">
          <Eye className="size-4 text-primary" />
          <h2 className="mt-4 text-lg font-semibold">Public profile</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Visible to everyone: handle, interests, posts, comments and project proposals.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Posts</span> <span className="font-mono">4</span>
            </li>
            <li className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Comments</span> <span className="font-mono">19</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Upvotes given</span>{" "}
              <span className="font-mono">{12 + upvoted.length}</span>
            </li>
          </ul>
        </section>

        <section className="bg-card p-6">
          <EyeOff className="size-4 text-primary" />
          <h2 className="mt-4 text-lg font-semibold">Private learning data</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Never shown to other people: progress, quiz answers and saved items.
          </p>
          <ul className="mt-5 space-y-4">
            {modules.slice(0, 4).map((m) => (
              <li key={m.slug}>
                <div className="flex items-center justify-between text-sm">
                  <Link to="/learn/$slug" params={{ slug: m.slug }} className="hover:text-primary">
                    {m.title}
                  </Link>
                  <span className="font-mono text-xs text-muted-foreground">{m.progress}%</span>
                </div>
                <Progress value={m.progress} className="mt-2 h-1" />
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-card p-6">
          <BarChart3 className="size-4 text-primary" />
          <h2 className="mt-4 text-lg font-semibold">Anonymised analytics</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Contributed as aggregate counts only, never linked back to {anonId}.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            <li className="border-b border-border pb-2">Cohort: undergraduate, fusion track</li>
            <li className="border-b border-border pb-2">Contribution: 1 of 4,120 learners</li>
            <li>k-anonymity threshold: 25</li>
          </ul>
          <Link to="/analytics" className="mt-5 inline-block text-sm text-primary">
            View aggregate dashboard
          </Link>
        </section>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="hairline rounded-lg p-6">
          <p className="eyebrow">Completed modules</p>
          <ul className="mt-4 space-y-3 text-sm">
            {completed.map((m) => (
              <li key={m.slug}>
                <Link to="/learn/$slug" params={{ slug: m.slug }} className="hover:text-primary">
                  {m.title}
                </Link>
                <p className="font-mono text-xs text-muted-foreground">{m.category}</p>
              </li>
            ))}
            {completed.length === 0 && <li className="text-muted-foreground">Nothing finished yet.</li>}
          </ul>
        </div>
        <div className="hairline rounded-lg p-6">
          <p className="eyebrow">Saved resources</p>
          <ul className="mt-4 space-y-3 text-sm">
            {savedPosts.map((p) => (
              <li key={p.id}>
                <Link to="/community/$postId" params={{ postId: p.id }} className="line-clamp-2 hover:text-primary">
                  {p.body}
                </Link>
                <p className="font-mono text-xs text-muted-foreground">{p.handle}</p>
              </li>
            ))}
            {savedPosts.length === 0 && <li className="text-muted-foreground">Nothing saved yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
