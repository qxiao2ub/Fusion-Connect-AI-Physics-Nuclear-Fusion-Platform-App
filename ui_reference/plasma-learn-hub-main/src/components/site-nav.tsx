import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, User, Atom } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { modules, posts, proposals } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-state";

const links = [
  { to: "/", label: "Home" },
  { to: "/learn", label: "Learn" },
  { to: "/community", label: "Community" },
  { to: "/collaborate", label: "Collaborate" },
  { to: "/mentor", label: "AI Mentor" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

function SearchDialog() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const term = q.trim().toLowerCase();
  const mods = term ? modules.filter((m) => m.title.toLowerCase().includes(term)) : modules.slice(0, 3);
  const feed = term ? posts.filter((p) => p.body.toLowerCase().includes(term)) : [];
  const projs = term ? proposals.filter((p) => p.title.toLowerCase().includes(term)) : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Search" className="min-h-11 min-w-11">
          <Search className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display">Search the platform</DialogTitle>
        </DialogHeader>
        <Input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try “tokamak”, “Debye”, “disruption”…"
        />
        <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
          <SearchGroup label="Modules">
            {mods.map((m) => (
              <Link
                key={m.slug}
                to="/learn/$slug"
                params={{ slug: m.slug }}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
              >
                {m.title}
                <span className="ml-2 text-xs text-muted-foreground">{m.category}</span>
              </Link>
            ))}
          </SearchGroup>
          {feed.length > 0 && (
            <SearchGroup label="Discussions">
              {feed.map((p) => (
                <Link
                  key={p.id}
                  to="/community/$postId"
                  params={{ postId: p.id }}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  <span className="line-clamp-1">{p.body}</span>
                </Link>
              ))}
            </SearchGroup>
          )}
          {projs.length > 0 && (
            <SearchGroup label="Projects">
              {projs.map((p) => (
                <Link
                  key={p.id}
                  to="/collaborate"
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  {p.title}
                </Link>
              ))}
            </SearchGroup>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SearchGroup({ label, children }: { label: string; children: ReactNodeLike }) {
  return (
    <div>
      <p className="eyebrow mb-1 px-3">{label}</p>
      {children}
    </div>
  );
}
type ReactNodeLike = React.ReactNode;

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { anonId } = useAppState();
  const [openMobile, setOpenMobile] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="relative flex size-8 items-center justify-center rounded-full border border-primary/40">
            <Atom className="size-4 text-primary" />
          </span>
          <span className="font-display text-sm font-semibold tracking-tight">
            Fusion Connect <span className="text-primary">AI</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <SearchDialog />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Profile menu" className="min-h-11 min-w-11">
                <User className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-mono text-xs text-muted-foreground">{anonId}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/analytics">Analytics</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/qr">QR generator</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/onboarding">Restart onboarding</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={openMobile} onOpenChange={setOpenMobile}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="min-h-11 min-w-11 lg:hidden">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-display">Navigate</SheetTitle>
              <nav className="mt-6 flex flex-col">
                {[...links, { to: "/analytics", label: "Analytics" }, { to: "/qr", label: "QR Generator" }, { to: "/profile", label: "Profile" }].map(
                  (l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpenMobile(false)}
                      className="border-b border-border py-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  ),
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-mono">FUSION CONNECT AI · PROTOTYPE · MOCK DATA ONLY</p>
        <p>Anonymous by default. No tracking beyond aggregated, on-device counts.</p>
      </div>
    </footer>
  );
}
