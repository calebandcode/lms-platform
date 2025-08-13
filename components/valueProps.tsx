import { BadgeCheck, Clock, TrendingUp } from "lucide-react";

export function ValueProps() {
  const items = [
    { icon: BadgeCheck, title: "Expert-led", text: "Courses by proven industry mentors." },
    { icon: Clock, title: "Learn at your pace", text: "Bite-sized lessons, lifetime access." },
    { icon: TrendingUp, title: "Career outcomes", text: "Guided projects & portfolio prep." },
  ];

  return (
    <section className="w-full py-6">
      <div className="container mx-auto px-4 grid gap-4 md:grid-cols-3">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3 rounded-xl border p-4">
            <div className="mt-1 rounded-lg bg-primary/10 p-2">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">{title}</div>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
