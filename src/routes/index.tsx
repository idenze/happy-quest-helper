import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ọzịtụma dashboards — design prototype" },
      {
        name: "description",
        content:
          "A buildless HTML and CSS prototype for the Ọzịtụma contributor/editor and administrator dashboards: tokens, screens, component inventory and notes.",
      },
      { property: "og:title", content: "Ọzịtụma dashboards — design prototype" },
      {
        property: "og:description",
        content:
          "Two dashboards for three roles, in plain HTML and CSS: tokens, eight screens, component inventory and implementation notes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const dashboardA = [
  { href: "/ozituma/screens/contribute-overview.html", title: "Overview", note: "/contribute — standing, decisions, the editor queue" },
  { href: "/ozituma/screens/contribute-word.html", title: "Add a word", note: "/contribute/word — the form in full, with its error state" },
  { href: "/ozituma/screens/contribute-submissions.html", title: "Your submissions", note: "/contribute/submissions — states, reasons, empty state" },
  { href: "/ozituma/screens/review.html", title: "Review queue", note: "/review — editor and admin only" },
];

const dashboardB = [
  { href: "/ozituma/screens/admin-dashboard.html", title: "Dashboard", note: "/admin — what the record holds, what needs attention" },
  { href: "/ozituma/screens/admin-users.html", title: "Users", note: "/admin/users — sort, filter, bulk actions" },
  { href: "/ozituma/screens/admin-appearance.html", title: "Appearance", note: "/admin/appearance — six colours, logo, width, menu order" },
  { href: "/ozituma/screens/admin-analytics.html", title: "Analytics", note: "/admin/analytics — both sites, side by side" },
];

const deliverables = [
  { href: "/ozituma/tokens.css", title: "tokens.css", note: "the custom properties on their own, in oklch()" },
  { href: "/ozituma/styles/dashboard.css", title: "styles/dashboard.css", note: "the component layer, plain CSS" },
  { href: "/ozituma/NOTES.md", title: "NOTES.md", note: "rationale, component inventory, every departure" },
];

function Section({
  heading,
  items,
}: {
  heading: string;
  items: { href: string; title: string; note: string }[];
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{heading}</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="block rounded-md border border-border bg-card p-4 transition-colors hover:border-ring"
            >
              <span className="block font-semibold text-card-foreground">{item.title}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{item.note}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Index() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
        Design prototype · plain HTML and CSS, no build step
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
        The Ọzịtụma dashboards
      </h1>
      <p className="mt-4 text-muted-foreground">
        Two dashboards for three roles. A is the single workspace shared by contributors and
        editors — the review queue is extra authority inside the same shell, never a second
        product. B is the administrator's instrument panel. They share one type scale, one spacing
        rhythm and one colour semantic; they differ in density and navigation.
      </p>
      <p className="mt-3 text-muted-foreground">
        Every screen is server-renderable markup: plain post forms to the existing API routes,
        original field names untouched, details/summary for every disclosure, and nothing that
        needs JavaScript to be usable.
      </p>

      <Section heading="Dashboard A — contributor / editor" items={dashboardA} />
      <Section heading="Dashboard B — administrator" items={dashboardB} />
      <Section heading="The rest of the deliverable" items={deliverables} />

      <p className="mt-10 text-sm text-muted-foreground">
        Narrow the window to 375px to see the mobile layout: both dashboards collapse to one
        column and the navigation becomes disclosures — still without JavaScript.
      </p>
    </main>
  );
}
