import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Copy, QrCode, RefreshCw, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { modules, posts, proposals } from "@/lib/mock-data";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "QR Generator — Share Modules & Projects | Fusion Connect AI" },
      { name: "description", content: "Generate a shareable QR code for any module, project, post or resource." },
      { property: "og:title", content: "QR generator" },
      { property: "og:description", content: "Turn any module, project or post into a classroom-ready QR code." },
    ],
  }),
  component: QrPage,
});

type Kind = "module" | "project" | "post" | "resource";

function pseudoMatrix(seed: string, size = 21) {
  let h = 7;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 100003;
  const cells: boolean[] = [];
  for (let i = 0; i < size * size; i++) {
    h = (h * 1103515245 + 12345) % 2147483647;
    cells.push(h % 100 > 48);
  }
  return cells;
}

function QrPage() {
  const [kind, setKind] = useState<Kind>("module");
  const [target, setTarget] = useState(modules[0]!.title);
  const [nonce, setNonce] = useState(0);

  const options = useMemo(() => {
    if (kind === "module") return modules.map((m) => m.title);
    if (kind === "project") return proposals.map((p) => p.title);
    if (kind === "post") return posts.map((p) => `${p.author}: ${p.body.slice(0, 40)}…`);
    return ["Fusion glossary (PDF)", "Lawson criterion worksheet", "Tokamak schematic poster", "Plasma safety checklist"];
  }, [kind]);

  const url = `fusionconnect.ai/s/${kind}/${target.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 28)}`;
  const size = 21;
  const cells = pseudoMatrix(url + nonce, size);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <p className="eyebrow">Share offline</p>
      <h1 className="mt-3 text-4xl font-semibold">QR Generator</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Print a code on a lab door, a lecture slide or a handout. Prototype preview — codes are illustrative.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <Tabs
            value={kind}
            onValueChange={(v) => {
              const k = v as Kind;
              setKind(k);
              setTarget(
                k === "module"
                  ? modules[0]!.title
                  : k === "project"
                    ? proposals[0]!.title
                    : k === "post"
                      ? `${posts[0]!.author}: ${posts[0]!.body.slice(0, 40)}…`
                      : "Fusion glossary (PDF)",
              );
            }}
          >
            <TabsList>
              <TabsTrigger value="module">Module</TabsTrigger>
              <TabsTrigger value="project">Project</TabsTrigger>
              <TabsTrigger value="post">Post</TabsTrigger>
              <TabsTrigger value="resource">Resource</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-6 space-y-2">
            {options.map((o) => (
              <button
                key={o}
                onClick={() => setTarget(o)}
                className={`block w-full rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                  target === o ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                }`}
              >
                {o}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <p className="eyebrow mb-2">Destination</p>
            <Input readOnly value={url} className="font-mono text-xs" />
          </div>
        </div>

        <aside className="hairline h-fit rounded-lg bg-card p-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-2">
            <QrCode className="size-4 text-primary" />
            <p className="eyebrow">Preview</p>
          </div>
          <div className="mt-5 rounded-md bg-surface p-4">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full" role="img" aria-label="QR code preview">
              {cells.map((on, i) =>
                on ? (
                  <rect key={i} x={i % size} y={Math.floor(i / size)} width="1" height="1" fill="var(--surface-foreground)" />
                ) : null,
              )}
              {[
                [0, 0],
                [size - 7, 0],
                [0, size - 7],
              ].map(([x, y]) => (
                <g key={`${x}-${y}`}>
                  <rect x={x} y={y} width="7" height="7" fill="var(--surface)" />
                  <rect x={x} y={y} width="7" height="7" fill="none" stroke="var(--surface-foreground)" strokeWidth="1" />
                  <rect x={Number(x) + 2} y={Number(y) + 2} width="3" height="3" fill="var(--surface-foreground)" />
                </g>
              ))}
            </svg>
          </div>
          <p className="mt-4 break-all font-mono text-[11px] text-muted-foreground">{url}</p>
          <div className="mt-5 space-y-2">
            <Button className="w-full" onClick={() => setNonce((n) => n + 1)}>
              <RefreshCw className="size-4" /> Generate
            </Button>
            <Button variant="outline" className="w-full" onClick={() => toast.success("Link copied to clipboard")}>
              <Copy className="size-4" /> Copy link
            </Button>
            <Button variant="outline" className="w-full" onClick={() => toast("Share sheet opened")}>
              <Share2 className="size-4" /> Share
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
