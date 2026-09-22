function PlaceholderPage({ description, title }) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Route ready
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 max-w-2xl text-slate-600">{description}</p>
    </section>
  );
}

export default PlaceholderPage;
