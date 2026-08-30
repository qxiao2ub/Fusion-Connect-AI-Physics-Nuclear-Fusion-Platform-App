import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Diagram } from "@/components/plasma-visuals";
import { modules } from "@/lib/mock-data";

export const Route = createFileRoute("/learn/$slug")({
  loader: ({ params }) => {
    const mod = modules.find((m) => m.slug === params.slug);
    if (!mod) throw notFound();
    return { mod };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Module unavailable" }, { name: "robots", content: "noindex" }] };
    const { mod } = loaderData;
    return {
      meta: [
        { title: `${mod.title} — Fusion Connect AI` },
        { name: "description", content: mod.summary },
        { property: "og:title", content: mod.title },
        { property: "og:description", content: mod.summary },
      ],
    };
  },
  component: ModulePage,
});

function ModulePage() {
  const { mod } = Route.useLoaderData();
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const lesson = mod.lessons[idx]!;
  const pct = Math.round(((idx + 1) / mod.lessons.length) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> All modules
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase">
            {mod.category}
          </Badge>
          <h1 className="mt-4 text-2xl font-semibold">{mod.title}</h1>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            {mod.difficulty} · {mod.minutes} min
          </p>
          <Progress value={pct} className="mt-5 h-1" />
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">
            LESSON {idx + 1} / {mod.lessons.length} · {pct}%
          </p>
          <nav className="mt-6 space-y-1 border-t border-border pt-4">
            {mod.lessons.map((l, i) => (
              <button
                key={l.id}
                onClick={() => {
                  setIdx(i);
                  setAnswer(null);
                }}
                className={`flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors ${
                  i === idx ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {i < idx ? (
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                ) : (
                  <Circle className="mt-0.5 size-3.5 shrink-0" />
                )}
                {l.title}
              </button>
            ))}
          </nav>
        </aside>

        <article className="min-w-0">
          <p className="eyebrow">Lesson {idx + 1}</p>
          <h2 className="mt-3 text-3xl font-semibold">{lesson.title}</h2>
          <div className="mt-6 space-y-5">
            {lesson.body.map((p) => (
              <p key={p.slice(0, 24)} className="text-[15px] leading-[1.75] text-muted-foreground">
                {p}
              </p>
            ))}
          </div>

          {lesson.equation && (
            <figure className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
              <p className="font-mono text-lg text-primary sm:text-xl">{lesson.equation.latex}</p>
              <figcaption className="mt-3 text-xs text-muted-foreground">{lesson.equation.caption}</figcaption>
            </figure>
          )}

          {lesson.diagram && (
            <figure className="mt-8">
              <Diagram kind={lesson.diagram} className="w-full rounded-lg border border-border bg-card p-4" />
              <figcaption className="eyebrow mt-3">Figure {idx + 1} · schematic</figcaption>
            </figure>
          )}

          <section className="mt-12 rounded-lg border border-primary/30 bg-card p-6">
            <p className="eyebrow">Knowledge check</p>
            <h3 className="mt-3 text-lg font-semibold">{mod.check.question}</h3>
            <div className="mt-4 space-y-2">
              {mod.check.options.map((o, i) => {
                const chosen = answer === i;
                const correct = i === mod.check.answer;
                return (
                  <button
                    key={o}
                    onClick={() => {
                      setAnswer(i);
                      toast[correct ? "success" : "error"](correct ? "Correct" : "Not quite — read the explanation.");
                    }}
                    className={`w-full rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                      answer === null
                        ? "border-border hover:border-primary/50"
                        : correct
                          ? "border-primary/60 bg-primary/10"
                          : chosen
                            ? "border-destructive/60 bg-destructive/10"
                            : "border-border opacity-60"
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
            {answer !== null && <p className="mt-4 text-sm text-muted-foreground">{mod.check.explain}</p>}
          </section>

          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <Button
              variant="outline"
              disabled={idx === 0}
              onClick={() => {
                setIdx((i) => Math.max(0, i - 1));
                setAnswer(null);
              }}
            >
              <ArrowLeft className="size-4" /> Previous
            </Button>
            {idx < mod.lessons.length - 1 ? (
              <Button
                onClick={() => {
                  setIdx((i) => i + 1);
                  setAnswer(null);
                }}
              >
                Next lesson <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button onClick={() => toast.success(`${mod.title} marked complete`)}>
                Complete module <CheckCircle2 className="size-4" />
              </Button>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
