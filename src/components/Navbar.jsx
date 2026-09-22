import { Link, NavLink } from "react-router-dom";
import Badge from "./Badge.jsx";
import Button from "./Button.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useCart } from "../hooks/useCart.js";
import { useWishlist } from "../hooks/useWishlist.js";

const linkClass = ({ isActive }) =>
  `rounded-md px-2 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ${
    isActive ? "text-slate-950" : "text-slate-500 hover:text-slate-950"
  }`;

function Navbar() {
  const { currentUser, isAdmin, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistItems } = useWishlist();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5">
        <Link
          className="mr-auto min-w-0 text-lg font-semibold tracking-tight"
          to="/"
        >
          Commerce Assessment
        </Link>
        <nav
          aria-label="Primary navigation"
          className="flex flex-wrap items-center gap-3 sm:gap-5"
        >
          <NavLink className={linkClass} to="/">
            Home
          </NavLink>
          <NavLink className={linkClass} to="/shop">
            Shop
          </NavLink>
          <NavLink className={linkClass} to="/wishlist">
            Wishlist <Badge>{wishlistItems.length}</Badge>
          </NavLink>
          <NavLink className={linkClass} to="/cart">
            Cart <Badge>{itemCount}</Badge>
          </NavLink>
          {isAdmin && (
            <NavLink className={linkClass} to="/admin">
              Admin
            </NavLink>
          )}
          {isAuthenticated ? (
            <Button onClick={logout} size="sm" variant="ghost">
              Logout ({currentUser?.name ?? "Account"})
            </Button>
          ) : (
            <NavLink className={linkClass} to="/login">
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
