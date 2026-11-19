# Srivalli jewellers Management System

Professional frontend for jewellery shop management — ERP-style UI with React, Vite, Tailwind CSS, Material UI, and Framer Motion.

## Tech Stack

- React 19 + Vite 8
- React Router DOM
- Tailwind CSS v4
- Material UI
- Redux Toolkit
- React Hook Form
- Framer Motion
- Recharts
- Axios (pre-configured)

## Getting Started

### 1. WordPress backend (one-time)

1. In WordPress install and activate the **Code Snippets** plugin.
2. **Snippets → Add New**, name it `Srivalli Jewellers API`.
3. Open `backend/srivalli-jewellers-api.php`, copy everything **below** the first `<?php` line and paste it into the snippet.
4. Select **Run snippet everywhere** → **Save Changes and Activate**.
5. **No permalink change needed.** The app uses WordPress's `?rest_route=` URL format, which works with every permalink setting (including *Plain*), so other snippets and URLs on the site are untouched.
6. Check it works: open `https://your-site.com/?rest_route=/srivalli/v1/products` in a browser – you should see a JSON message saying to sign in (401). That means the API is live.

### 2. React app

```bash
cd srivalli-jewellers
cp .env.example .env      # then set VITE_API_URL to your site
npm install
npm run dev
```

`.env`:

```
VITE_API_URL=https://your-site.com/?rest_route=/srivalli/v1
```

(If the site is installed in a sub-folder, include it: `https://your-site.com/blog/?rest_route=/srivalli/v1`. Sites with pretty permalinks may also use `https://your-site.com/wp-json/srivalli/v1` – both formats are supported.)

Open [http://localhost:5173](http://localhost:5173), click **Create account** (or sign in with an existing WordPress username/email and password).

> Restart `npm run dev` / rebuild after changing `.env` – Vite reads it at build time.

## Build

```bash
npm run build
npm run preview
```

## Accounts & data

- Every user signs in and gets their own dashboard, stock list, search and Deleted Items.
- Products are stored in WordPress (custom post type `sj_product`, owner = the user who created it). The API only ever returns, edits or deletes the signed-in user's own items; another user's product ID returns *Product not found*.
- Product photos are uploaded to the WordPress Media Library (resized to max 1200px in the browser first).
- Login is a simple token (demo level): username/email + password → token saved in the browser and sent as a Bearer `Authorization` header. Tokens last 30 days; **Log out** revokes it.
- Admins can browse all items in wp-admin → **Jewellery Items**.
- Shop/rate/invoice **Settings** are still local to the browser session (unchanged).

### API endpoints (`?rest_route=/srivalli/v1`)

Example: `GET https://your-site.com/?rest_route=/srivalli/v1/products`

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register` | Create account → `{ token, user }` |
| POST | `/auth/login` | Sign in → `{ token, user }` |
| GET | `/auth/me` | Current user |
| POST | `/auth/logout` | Revoke token |
| GET | `/products` | Own items (active + deleted) |
| POST | `/products` | Add item |
| GET | `/products/{id}` | One own item |
| PUT | `/products/{id}` | Update own item |
| DELETE | `/products/{id}` | Move to Deleted Items |

### Troubleshooting

- **"Cannot reach the server"** – check `VITE_API_URL`, that the site is HTTPS if the app is HTTPS, and that the snippet is active.
- **404 / HTML page instead of JSON** – make sure `VITE_API_URL` uses the `?rest_route=/srivalli/v1` form (the `/wp-json/` form needs pretty permalinks).
- **Save works but edit/delete fails with 403/405** – some hosts block PUT/DELETE; ask the host to allow them for WordPress REST API requests.
- **Requests blocked** – security plugins that disable the REST API for logged-out visitors must allow the `srivalli/v1` namespace.
- Query strings are joined with `&` automatically (e.g. `?rest_route=/srivalli/v1/products&status=deleted`); `src/services/api.js → buildApiUrl()` handles this.
- To turn off sign-up from the app, set `SJ_ALLOW_REGISTRATION` to `false` at the top of the snippet and create users in wp-admin instead.

## Features

- Login / create account, per-user dashboard and items (WordPress backend)
- Dashboard with stats, gold/silver rates, charts, low stock alerts
- Top navigation with dropdown submenus (Purchase, Stock, Sales, etc.)
- Collapsible sidebar quick access
- Add Product form with auto ID generation (e.g. `GLD-RNG-22K-0001`)
- Stock list with search, filter, pagination, view modal
- POS-style New Sale billing
- Customer management with add modal
- Reports with charts and date filters
- Settings (shop, rates, invoice, theme)

## API Integration

`src/services/api.js` (Axios, adds the login token), `src/services/authService.js`, `src/services/productService.js`. Product state lives in `src/redux/slices/productsSlice.js`; login in `authSlice.js`.

## Folder Structure

```
backend/        # WordPress Code Snippets PHP (copy-paste)
src/
  components/   # Reusable UI
  pages/        # Route pages
  layouts/      # MainLayout
  routes/       # AppRoutes
  services/     # Axios API + auth/product services
  hooks/        # useProducts, useSavedProducts, useDebounce…
  redux/        # Store & slices
  utils/        # Helpers & constants
  data/         # Dummy JSON data
```
