import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Mancha" },
      { name: "description", content: "Reach the Mancha team." },
      { property: "og:title", content: "Contact — Mancha" },
      { property: "og:description", content: "Partnerships, press, and general enquiries." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PublicLayout>
      <PageHero eyebrow="Say Hello" title="Contact us" description="Partnerships, press, or general enquiries — we'd love to hear from you." />
      <section className="container-page py-16">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            {[
              { Icon: Mail, label: "Email", value: "hello@mancha.com" },
              { Icon: Phone, label: "Phone", value: "+880 1XXX XXXXXX" },
              { Icon: MapPin, label: "Studio", value: "Dhaka, Bangladesh" },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <form className="rounded-2xl border border-border bg-card p-8 shadow-soft" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@stage.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What's on your mind?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={5} placeholder="Tell us more…" />
              </div>
              <Button type="submit" size="lg" className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
                Send message
              </Button>
            </div>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}
