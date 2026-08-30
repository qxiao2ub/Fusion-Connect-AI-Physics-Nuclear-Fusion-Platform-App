import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, GraduationCap, Clock, MessagesSquare } from "lucide-react";
import { Area, AreaChart, CartesianGrid, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Progress } from "@/components/ui/progress";
import { modules, topicMastery, weeklyActivity } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Your Fusion Learning Progress | Fusion Connect AI" },
      { name: "description", content: "Track modules completed, study streak, topics explored and community activity." },
      { property: "og:title", content: "Your learning dashboard" },
      { property: "og:description", content: "Progress, streaks and topic mastery across the fusion curriculum." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { icon: GraduationCap, label: "Modules completed", value: "3 / 6" },
  { icon: Flame, label: "Day streak", value: "12" },
  { icon: Clock, label: "Minutes this week", value: "300" },
  { icon: MessagesSquare, label: "Community actions", value: "27" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="eyebrow">Private to you</p>
      <h1 className="mt-3 text-4xl font-semibold">Dashboard</h1>

      <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card p-6">
            <s.icon className="size-4 text-primary" />
            <p className="mt-4 font-display text-3xl font-semibold">{s.value}</p>
            <p className="eyebrow mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="hairline rounded-lg bg-card p-6">
          <p className="eyebrow">Study minutes · last 7 days</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivity} margin={{ left: -20, right: 8 }}>
                <defs>
                  <linearGradient id="fillMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--plasma)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--plasma)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="minutes" stroke="var(--plasma)" fill="url(#fillMinutes)" strokeWidth={1.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="hairline rounded-lg bg-card p-6">
          <p className="eyebrow">Topic mastery</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={topicMastery} outerRadius="72%">
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="topic" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Radar dataKey="value" stroke="var(--signal)" fill="var(--plasma)" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="hairline rounded-lg bg-card p-6">
          <p className="eyebrow">Module progress</p>
          <ul className="mt-5 space-y-5">
            {modules.map((m) => (
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
        </div>

        <div className="hairline rounded-lg bg-card p-6">
          <p className="eyebrow">Recent activity</p>
          <ul className="mt-5 space-y-4 text-sm">
            {[
              ["Completed", "Frozen-in flux — Electromagnetism for Plasmas", "2h ago"],
              ["Upvoted", "Pedestal width vs EPED prediction", "5h ago"],
              ["Saved", "Grad–Shafranov solver thread", "yesterday"],
              ["Joined", "Open Grad–Shafranov equilibrium library", "3 days ago"],
              ["Scored 4/5", "Magnetic Confinement knowledge check", "4 days ago"],
            ].map(([k, v, t]) => (
              <li key={v} className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0">
                <span>
                  <span className="font-mono text-xs text-primary">{k}</span>
                  <span className="ml-2 text-muted-foreground">{v}</span>
                </span>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
