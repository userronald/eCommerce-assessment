# Commerce Assessment Store

## Overview

E-Commerce Assessment Store is a frontend-only e-commerce application created for My technical assessment. It demonstrates product discovery, authentication, cart and wishlist workflows, checkout with simulated order creation, customer support, and an admin management area.

The application uses JSON Server as a local mock REST API. It does not include a real backend, payment provider, Firebase integration, or production authentication system.

## Features

- Promotional home page with featured products and brand navigation
- Product search, category and brand filtering, price range filtering, and price sorting
- Product detail pages with image gallery, specifications, stock state, cart, and wishlist actions
- Customer registration and login
- Customer/admin role detection and protected routes
- Persistent cart, wishlist, authentication, and support submissions through LocalStorage
- Coupon codes `SAVE10` and `SAVE20`
- Checkout and simulated order creation
- About Us, searchable FAQ, and Customer Support pages
- Admin dashboard with catalog metrics and revenue summary
- Admin product and category CRUD
- Read-only order ledger populated by checkout orders
- Loading, empty, error, validation, and missing-data fallback states
- Responsive layouts for mobile, tablet, and desktop widths

## Tech Stack

- React 19
- JavaScript with JSX
- Vite
- React Router DOM
- Tailwind CSS
- Context API and custom React hooks
- JSON Server
- LocalStorage
- Oxlint

## Architecture

The application is organized around a small number of understandable boundaries:

- Pages own route-level workflows and compose reusable components.
- Components provide reusable UI primitives, forms, product cards, feedback states, dialogs, and layout elements.
- Context providers own genuinely global state: authentication, cart, and wishlist.
- Custom hooks expose the context APIs as `useAuth()`, `useCart()`, and `useWishlist()`.
- `src/services/api.js` is the single API access layer.
- `src/utils/data.js` contains reusable data normalization and formatting helpers.
- `src/utils/storage.js` provides defensive LocalStorage access.

## Project Structure

```text
.
├── db.json
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   └── utils/
├── .env.example
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Authentication

Authentication is simulated against the `users` collection in `db.json`.

- Customers can register and log in.
- Registration creates a customer account through the mock API.
- Login stores a password-free public user object in LocalStorage.
- `ProtectedRoute` protects wishlist, cart, and checkout.
- `AdminRoute` requires an authenticated user with `role === "admin"`.
- Login preserves the intended protected destination when practical.

This authentication model is for demonstration only. Passwords are not suitable for production storage.

## State Management

The application uses the React Context API for shared state:

- `AuthContext`: current user, login, registration, logout, and role detection.
- `CartContext`: cart items, quantity operations, coupons, subtotal, discount, and total.
- `WishlistContext`: wishlist items, remove/add operations, and moving items to the cart.

Context is limited to state required across multiple routes. Page-specific form and loading state remains local to each page.

## Data Persistence

### JSON Server

JSON Server serves the root-level `db.json` file at `http://localhost:3001`. It provides mock REST collections for:

- Users
- Products
- Categories
- Orders

CRUD and read operations are centralized in `src/services/api.js`.

### LocalStorage

LocalStorage is used for frontend persistence of:

- Authenticated user session
- Cart items and applied coupon
- Wishlist items
- Customer support submissions

Malformed JSON, unavailable storage, and invalid stored shapes fall back to safe defaults.

## API Endpoints

| Method   | Endpoint          | Purpose                            |
| -------- | ----------------- | ---------------------------------- |
| `GET`    | `/products`       | List products                      |
| `GET`    | `/products/:id`   | Get one product                    |
| `POST`   | `/products`       | Create a product                   |
| `PUT`    | `/products/:id`   | Update a product                   |
| `DELETE` | `/products/:id`   | Delete a product                   |
| `GET`    | `/categories`     | List categories                    |
| `POST`   | `/categories`     | Create a category                  |
| `PUT`    | `/categories/:id` | Update a category                  |
| `DELETE` | `/categories/:id` | Delete a category                  |
| `GET`    | `/users`          | List users for demo authentication |
| `POST`   | `/users`          | Register a customer                |
| `GET`    | `/orders`         | List orders for the admin ledger   |
| `POST`   | `/orders`         | Create a simulated checkout order  |

The API service checks `response.ok`, parses JSON when possible, validates collection/object responses, and throws useful errors for failures.

## Installation

Requirements:

- Node.js and npm

Install dependencies:

```bash
npm install
```

Optional environment override:

```bash
Copy-Item .env.example .env
```

The default API URL is `http://localhost:3001`. Set `VITE_API_BASE_URL` in `.env` only when using a different local API URL.

## Running the Project

Run JSON Server in one terminal:

```bash
npm run server
```

Run the Vite development server in another terminal:

```bash
npm run dev
```

Other package scripts:

```bash
npm run build
npm run lint
npm run preview
```

## Demo Credentials

These credentials exist in the current `db.json` and are intended only for local assessment use:

| Role          | Email                       | Password         |
| ------------- | --------------------------- | ---------------- |
| Customer      | `alex.johnson@example.com`  | `demo-user-123`  |
| Customer      | `morgan.lee@example.com`    | `demo-user-123`  |
| Administrator | `admin@commerce-demo.local` | `demo-admin-123` |

Do not use these demo credentials outside the local project.

## Assessment Requirements

| Requirement area         | Implementation                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| React, JSX, hooks        | Functional components, JSX, built-in hooks, and custom hooks throughout `src/`             |
| Context API              | Auth, cart, and wishlist providers in `src/context/`                                       |
| Routing                  | Public, protected, admin, product, confirmation, and 404 routes in `src/App.jsx`           |
| Authentication           | Login and registration pages backed by the users API                                       |
| Roles and protection     | Customer/admin roles with `ProtectedRoute` and `AdminRoute`                                |
| Home                     | Hero banner, API-backed featured products, brand index, and shop CTA                       |
| Shop                     | Search, category/brand/price filters, sorting, URL brand filter, and empty state           |
| Product details          | API lookup, gallery, specifications, stock, cart, wishlist, and quantity controls          |
| Cart and wishlist        | Quantity management, removal, coupons, totals, wishlist migration, and persistence         |
| Checkout                 | Validated customer form and simulated order creation                                       |
| Information pages        | About Us, searchable FAQ, and LocalStorage-backed support form                             |
| Admin                    | Dashboard metrics, product/category CRUD, and read-only API order ledger                   |
| Responsive/accessibility | Tailwind responsive utilities, semantic controls, focus states, loading/error/empty states |

## Defensive Data Handling

The project centralizes common defensive behavior:

- `asArray()` converts malformed collection values into safe empty arrays.
- `asObject()` protects nested object parsing such as specifications.
- `safeText()` handles missing, null, undefined, and empty strings.
- `safeImage()` provides `/favicon.svg` as a missing-image fallback.
- `safeNumber()` prevents invalid numeric values from breaking totals or displays.
- `safeDate()` handles missing and invalid order dates.
- API collection and object responses are validated before entering React state.
- Non-OK responses become readable errors.
- LocalStorage JSON parsing is wrapped in `try/catch` with default fallbacks.
- Product, order, customer, item, image, description, and specification fields use sensible defaults.

## Responsive Design

Tailwind responsive utilities support mobile, tablet, laptop, and desktop layouts. Product grids collapse at smaller widths, checkout and cart summaries stack on mobile, admin tables use contained horizontal scrolling, and long content wraps without forcing page-level overflow.

## Future Improvements

- Replace JSON Server with a real backend and database.
- Use secure server-side authentication and password hashing.
- Add automated unit, integration, and end-to-end tests.
- Add pagination and server-side search for larger catalogs.
- Add real payment-provider integration behind a backend boundary.
- Add order detail views and richer admin reporting.
- Add a formal design-token layer if the UI grows substantially.
