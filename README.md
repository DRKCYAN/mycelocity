# Mycelocity

A static, SEO-first hub of **connected** calculators for mushroom-growing businesses. Unlike isolated single-purpose tools, every calculator here shares one *grow profile* — change biological efficiency, price or substrate cost once and yield → revenue → margin → break-even → ROI all recompute, everywhere.

Built with **Astro (SSG) + React islands + TypeScript + Tailwind CSS v4 + nanostores**.

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
```

```bash
npm run build    # static HTML per page -> dist/
npm run preview  # serve the production build
```

## Architecture — the one thing to understand

**Store only raw user inputs. Every result is _derived_, never stored.** That single rule is what makes chaining automatic.

- **`src/store/inputs.ts`** — one shared nanostore (`$inputs`) holding the canonical grow profile (the raw inputs). Shared across every calculator and across in-session navigation (Astro's `<ClientRouter />` keeps the module singleton alive without a full reload, so no `localStorage` is needed in v1).
- **`src/store/useInputs.ts`** — React binding. Renders SSR-default values on the first client render (matching the server) then switches to the live store, so there are no hydration mismatches when carried-over values differ from defaults.
- **`src/lib/derivations.ts`** — pure functions: `calculateYield`, `calculateCOGS`, `calculateProfit`, … Each takes an inputs object and returns outputs, composing freely. They never read the store directly (so scenario mode can later call them with a different inputs object).
- **`src/lib/calculators.ts`** — the registry. Single source of truth (`id`, `title`, `slug`, `category`, `tier`, SEO copy, `connectedTo`) driving the sidebar, the `/calculators/[slug]` router, category index pages and per-page SEO.
- **`src/components/calculators/*`** — one React island per calculator. Each reads `useInputs()`, calls a derivation, and renders results. No island stores a computed value.

### Future-proofing seams (built, intentionally NOT implemented)

The premium features bolt on without a rewrite:

- `serializeInputs()` / `loadInputs()` in `inputs.ts` — no-op stubs. Persistence/shareable-URLs later = serialize that one object.
- `useEntitlement()` in `lib/entitlement.ts` — single feature-gating choke point; **always returns unlocked** in v1.
- `tier: 'free' | 'pro'` on every registry entry — the paywall later = flip a flag; the sidebar/router already read it.
- Pure, inputs-agnostic derivations — scenario comparison later = call them with best/expected/worst inputs.

Persistence, URL state encoding, scenarios, payments and auth are **deliberately not implemented**. Refreshing the page resets inputs, which is expected.

## SEO

Each calculator is statically generated at a human-readable slug (`/calculators/profit-per-block`) with a unique `<title>`, meta description, exactly one `<h1>`, a server-rendered explanatory paragraph + formula (crawlable without JS), and `WebApplication` JSON-LD. Islands are lazy (`client:visible`, except the showcase which is `client:load`). `sitemap-index.xml` and `robots.txt` are generated on build.
