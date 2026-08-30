import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, MessagesSquare, Users, Sparkles } from "lucide-react";
import heroImage from "@/assets/tokamak-hero.jpg";
import { Button } from "@/components/ui/button";
import { FieldLines, LawsonChart } from "@/components/plasma-visuals";
import { modules } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fusion Connect AI — Understand Fusion. Explore Physics." },
      {
        name: "description",
        content:
          "A scientific learning platform for plasma physics and nuclear fusion: guided modules, a research community, and collaborative projects.",
      },
      { property: "og:title", content: "Fusion Connect AI" },
      {
        property: "og:description",
        content: "Understand fusion. Explore physics. Connect ideas.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: BookOpen,
    title: "Learn",
    body: "Structured modules from Debye shielding to divertor engineering, with equations, diagrams and knowledge checks.",
    to: "/learn" as const,
  },
  {
    icon: MessagesSquare,
    title: "Connect",
    body: "A focused science feed where researchers, students and teachers debate real results — not engagement bait.",
    to: "/community" as const,
  },
  {
    icon: Users,
    title: "Collaborate",
    body: "Open research proposals and classroom projects with skills, team size and difficulty stated up front.",
    to: "/collaborate" as const,
  },
  {
    icon: Sparkles,
    title: "Personalise",
    body: "A transparent mentor that explains why each module, thread or project was recommended to you.",
    to: "/mentor" as const,
  },
];

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-field absolute inset-0 opacity-60" aria-hidden="true" />
        <FieldLines className="animate-drift pointer-events-none absolute -right-40 -top-40 size-[46rem] opacity-40" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="eyebrow">Plasma · Confinement · Energy</p>
            <h1 className="mt-5 text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
              Understand Fusion.
              <br />
              Explore Physics.
              <br />
              <span className="plasma-text">Connect Ideas.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
              A calm, rigorous place to learn how stars are bottled: guided physics modules, an honest research
              community, and collaborative projects for classrooms and labs alike.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/onboarding">
                  Start Learning <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/learn">Explore Fusion</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
              {[
                ["150M °C", "plasma core"],
                ["nTτ", "triple product"],
                ["17.6 MeV", "per D–T event"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-lg text-primary">{k}</dt>
                  <dd className="eyebrow mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="glow-ring overflow-hidden rounded-lg border border-border">
              <img
                src={heroImage}
                alt="Cutaway of a tokamak with a glowing plasma torus confined by magnetic field lines"
                width={1600}
                height={1200}
                className="w-full object-cover"
              />
            </div>
            <div className="hairline absolute -bottom-6 -left-6 hidden rounded-md bg-card/90 px-4 py-3 backdrop-blur sm:block">
              <p className="eyebrow">Confinement</p>
              <p className="font-mono text-sm text-primary">q(r) = r B_φ / (R B_θ)</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The platform</p>
            <h2 className="mt-3 text-3xl font-semibold">Four surfaces, one scientific loop</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Learn a concept, argue about it, then build something with people who care about the same problem.
          </p>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {features.map((f) => (
            <Link key={f.title} to={f.to} className="group bg-background p-8 transition-colors hover:bg-card">
              <f.icon className="size-5 text-primary" />
              <h3 className="mt-5 text-xl font-semibold">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight className="size-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Where the field stands</p>
            <h2 className="mt-3 text-3xl font-semibold">Six decades toward ignition</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Every module ties abstract plasma theory back to the single number that decides whether a reactor works:
              the triple product of density, temperature and energy confinement time.
            </p>
            <p className="mt-4 font-mono text-sm text-primary">n T τ_E ≳ 3 × 10²¹ keV·s·m⁻³</p>
          </div>
          <LawsonChart className="w-full rounded-lg border border-border bg-background p-6" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <p className="eyebrow">Start anywhere</p>
        <h2 className="mt-3 text-3xl font-semibold">Popular modules</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {modules.slice(0, 3).map((m) => (
            <Link
              key={m.slug}
              to="/learn/$slug"
              params={{ slug: m.slug }}
              className="hairline rounded-lg bg-card p-6 transition-colors hover:border-primary/50"
            >
              <p className="eyebrow">{m.category}</p>
              <h3 className="mt-3 text-lg font-semibold">{m.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{m.summary}</p>
              <p className="mt-4 font-mono text-xs text-muted-foreground">
                {m.difficulty} · {m.minutes} min
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
