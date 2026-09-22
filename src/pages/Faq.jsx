import { useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import Input from "../components/Input.jsx";
import FAQ_ITEMS from "../data/faq.js";

function Faq() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const matchingItems = FAQ_ITEMS.filter((item) => {
    if (!normalizedQuery) {
      return true;
    }

    return `${item.question} ${item.answer} ${item.category}`
      .toLowerCase()
      .includes(normalizedQuery);
  });

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
          Need to know
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-3 text-slate-600">
          Search for answers about products, orders, shipping, and support.
        </p>
      </header>

      <div className="max-w-2xl">
        <Input
          helpText={`${matchingItems.length} question${matchingItems.length === 1 ? "" : "s"} found`}
          id="faq-search"
          label="Search FAQs"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search questions or answers"
          type="search"
          value={query}
        />
      </div>

      {matchingItems.length === 0 ? (
        <EmptyState
          description="Try a different search term or browse all questions."
          title="No matching questions"
        />
      ) : (
        <section
          aria-label="Frequently asked questions"
          className="max-w-4xl space-y-3"
        >
          {matchingItems.map((item) => (
            <details
              className="group rounded-xl border border-slate-200 bg-white shadow-sm"
              key={item.id}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 text-base font-semibold text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="text-xl text-slate-400 transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                <p className="text-sm leading-7 text-slate-600">
                  {item.answer}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {item.category}
                </p>
              </div>
            </details>
          ))}
        </section>
      )}
    </div>
  );
}

export default Faq;
