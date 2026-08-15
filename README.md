# MapCap IPO · Backend

TypeScript API services behind the MapCap IPO system: token pricing,
investment bookkeeping, and the endpoints the frontend calls.

> **Part of the MapCap IPO system** · designed and built by
> [EslaM-X](https://github.com/EslaM-X).

---

## What it does

- **Pricing** — computes the spot price from a constant token supply
  (2,181,818 MapCap) and the current investment pool: `price = supply / pool`.
- **Data** — in-memory investment database behind a small service API.

## Stack

| Layer | Tech |
| --- | --- |
| Runtime | Node.js + TypeScript |
| Entry | `src/index.ts` (HTTP service) |
| Logic | `src/logic/pricing.ts` (pure, testable) |
| Data | `src/data/db.ts` |

## Quick start

```bash
npm install
npm run build && node dist/index.js
```

## Project layout

```
src/
  index.ts      service entry point
  logic/        pure pricing logic
  data/         investment store
```

## License

MIT. See `LICENSE`.
