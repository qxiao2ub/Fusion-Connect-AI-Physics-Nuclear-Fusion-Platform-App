import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { engagementSeries, popularTopics } from "@/lib/mock-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Aggregated Engagement | Fusion Connect AI" },
      { name: "description", content: "Anonymised, aggregated engagement: active learners, completion rate, popular topics and QR scans." },
      { property: "og:title", content: "Aggregated platform analytics" },
      { property: "og:description", content: "Privacy-preserving engagement metrics for educators and organisers." },
    ],
  }),
  component: Analytics,
});

const cards = [
  { label: "Active learners (30d)", value: "4,120", delta: "+19%" },
  { label: "Module completion", value: "58%", delta: "+3 pts" },
  { label: "Avg. session", value: "23 min", delta: "+2 min" },
  { label: "QR scans", value: "1,847", delta: "+41%" },
];

function Analytics() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="eyebrow">Aggregated · anonymised</p>
      <h1 className="mt-3 text-4xl font-semibold">Analytics</h1>

      <div className="mt-6 flex items-start gap-3 rounded-lg border border-primary/25 bg-primary/5 p-4">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Every figure here is a k-anonymous aggregate over at least 25 learners. No individual profile, quiz answer or
          reading history is exposed, and no cohort smaller than the threshold is displayed.
        </p>
      </div>

      <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card p-6">
            <p className="eyebrow">{c.label}</p>
            <p className="mt-3 font-display text-3xl font-semibold">{c.value}</p>
            <p className="mt-1 font-mono text-xs text-primary">{c.delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="hairline rounded-lg bg-card p-6">
          <p className="eyebrow">Active learners & completion</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementSeries} margin={{ left: -18, right: 8 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }}
                />
                <Line type="monotone" dataKey="learners" stroke="var(--plasma)" strokeWidth={1.6} dot={false} />
                <Line type="monotone" dataKey="completion" stroke="var(--plasma-deep)" strokeWidth={1.6} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="hairline rounded-lg bg-card p-6">
          <p className="eyebrow">Popular topics · sessions</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularTopics} layout="vertical" margin={{ left: 30, right: 12 }}>
                <CartesianGrid stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="topic" width={90} stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--accent)" }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }}
                />
                <Bar dataKey="sessions" fill="var(--plasma)" radius={[0, 3, 3, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 hairline rounded-lg bg-card p-6">
        <p className="eyebrow">Collaboration activity</p>
        <div className="mt-5 grid gap-6 sm:grid-cols-3">
          {[
            ["Open proposals", "38", "12 classroom · 26 research"],
            ["Join requests", "214", "68% accepted within a week"],
            ["Active teams", "51", "avg. 4.2 collaborators"],
          ].map(([k, v, s]) => (
            <div key={k}>
              <p className="font-display text-2xl font-semibold">{v}</p>
              <p className="eyebrow mt-1">{k}</p>
              <p className="mt-2 text-xs text-muted-foreground">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
