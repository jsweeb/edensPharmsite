# Security

## Reporting a vulnerability

Please email **info@edenspharm.com** with details and steps to reproduce.
Do not open a public GitHub issue for security problems.

## Automated checks

Every pull request and push to `main` runs `.github/workflows/security.yml`:

| Check | What it does | Fails the build on |
| --- | --- | --- |
| CodeQL (`security-extended`) | Static analysis of all JS/TS; results uploaded as SARIF to the repo's Security tab | New alerts are reported in code scanning |
| Dependency audit | `npm audit --omit=dev` | High or critical advisories in production dependencies |
| Dependency review (opt-in) | Diffs dependency changes in the PR; runs once the repo's Dependency graph is enabled and the `DEPENDENCY_REVIEW` repository variable is `true` | Newly added high or critical advisories |
| Secret scan | Gitleaks over the full git history | Any committed credential |

CodeQL and the dependency audit also run weekly on a schedule, so new
advisories are caught even without code changes.

## Security-sensitive surfaces

| Surface | Controls | Regression tests |
| --- | --- | --- |
| `app/api/samcart/webhook/route.ts` | Shared-secret header checked with a constant-time comparison; malformed JSON, missing `orderId` and invalid line items are rejected; order creation and inventory updates are idempotent (an `Idempotency-Key` for each step, and completed steps are remembered) so redeliveries can't duplicate orders or double-decrement stock | `__tests__/samcart-webhook.test.ts` |
| `app/checkout/page.tsx` (server actions) | Re-checks stock for every cart line before creating the SamCart session (`reconcileCart`): out-of-stock lines are dropped, quantities above stock are trimmed, and the shopper reviews the updated cart; a failed stock check fails closed. Refuses placeholder checkout URLs in production and redirects only to the URL SamCart returns | `__tests__/stock.test.ts`, `tests/happy-path.spec.ts` |
| `app/api/cart/route.ts`, `app/lib/cart.ts`, `app/lib/stock.ts` | The cart cookie is `httpOnly`, `sameSite=lax` and `secure` in production; tampered cookies are filtered (type, length, integer quantity 1–99, at most 20 lines). Adds are checked server-side against stock: unknown or out-of-stock variants and quantities beyond available stock are rejected (409) | `__tests__/cart.test.ts`, `__tests__/stock.test.ts`, `tests/happy-path.spec.ts` |
| Secrets | `VINEYARD_*` and `SAMCART_*` are server-only (no `NEXT_PUBLIC_` prefix) and `.env*` files are gitignored | Secret scan |

## Known follow-ups

- Confirm SamCart's real webhook signing scheme. If it signs the body with an
  HMAC, switch `verifyWebhookSignature` to HMAC-SHA256 over the raw payload.
- Webhook idempotency is remembered in-process. Across restarts it relies on
  Vineyard honouring `Idempotency-Key`; confirm Vineyard supports it.
