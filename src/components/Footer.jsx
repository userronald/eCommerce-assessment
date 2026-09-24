import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>E-Commerce Assessment Demo | 2026 Sep</p>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-4">
          <Link className="hover:text-slate-950" to="/about">
            About
          </Link>
          <Link className="hover:text-slate-950" to="/faq">
            FAQ
          </Link>
          <Link className="hover:text-slate-950" to="/support">
            Support
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
