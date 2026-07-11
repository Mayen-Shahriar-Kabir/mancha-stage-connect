import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Mancha" },
      { name: "description", content: "Sign in to your Mancha account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="hero-gradient min-h-screen">
      <div className="container-page flex min-h-screen items-center justify-center py-16">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="mx-auto mb-8 flex w-fit items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-brand-foreground shadow-gold">
              <span className="font-display text-lg leading-none">M</span>
            </span>
            <span className="font-display text-2xl">Mancha</span>
          </Link>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-elevated md:p-10">
            <h1 className="font-display text-3xl text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to your stage.</p>

            <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@stage.com" autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
                Sign in
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              New to Mancha?{" "}
              <Link to="/register" className="story-link font-medium text-brand">Create an account</Link>
            </p>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Authentication is a placeholder — the real curtain rises in a future phase.
          </p>
        </div>
      </div>
    </div>
  );
}
