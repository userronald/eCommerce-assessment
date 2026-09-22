import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";

const VALUES = [
  {
    title: "Useful by design",
    description:
      "We focus on products that solve real problems, feel good to use, and earn their place in your everyday setup.",
  },
  {
    title: "Clarity over noise",
    description:
      "Clear product information and considered recommendations make it easier to choose with confidence.",
  },
  {
    title: "People first",
    description:
      "Helpful support and respectful service matter just as much as the products in the box.",
  },
];

function About() {
  return (
    <div className="space-y-16 sm:space-y-20">
      <section className="rounded-2xl bg-slate-950 px-6 py-14 text-white sm:px-10 sm:py-20 lg:px-14">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
          About Commerce
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Better choices for the way you work, create, and live.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Commerce is a curated technology store built around a simple idea:
          shopping for useful tools should feel calm, informed, and human.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            Our mission
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Make good technology easier to find.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-slate-600">
            From the first search to the moment a product becomes part of your
            routine, we want every interaction to feel considered. That means
            honest details, practical collections, and support that respects
            your time.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-950">Our promise</p>
          <p className="mt-3 text-2xl font-semibold leading-tight text-slate-950">
            Useful products. Clear choices. Thoughtful service.
          </p>
        </div>
      </section>

      <section aria-labelledby="values-heading">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            What guides us
          </p>
          <h2
            className="mt-3 text-3xl font-semibold tracking-tight text-slate-950"
            id="values-heading"
          >
            The values behind the catalog.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {VALUES.map((value) => (
            <article
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              key={value.title}
            >
              <h3 className="text-lg font-semibold text-slate-950">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-sky-100 px-6 py-10 sm:flex-row sm:items-center sm:px-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Ready to explore?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Browse the collection or ask us a question.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button as={Link} to="/shop">
            Shop the collection
          </Button>
          <Button as={Link} to="/support" variant="secondary">
            Contact support
          </Button>
        </div>
      </section>
    </div>
  );
}

export default About;
