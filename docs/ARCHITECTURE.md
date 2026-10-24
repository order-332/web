# Architecture

One static HTML page. No framework, no build step, no server-side code, no third-party requests.

## Files

| Path | Purpose |
|---|---|
| `index.html` | Markup |
| `style.css` | All styles, including effects |
| `main.js` | Optional. Only if something needs JavaScript |
| `fonts/` | Self-hosted WOFF2, subset to the glyphs used |
| `img/` | Images and SVG |
| `_headers` | HTTP response headers, applied by the host |

## Serving

- A static host serves the files over HTTPS from its CDN. No origin server, database or runtime.
- Every response is a file from the repo. Nothing is generated per request.
- The host compresses responses (Brotli, gzip).

## Caching

| Files | `Cache-Control` |
|---|---|
| `index.html` | `no-cache` (revalidated on every visit) |
| CSS, JS, fonts, images | `public, max-age=86400` |

There is no build step, so filenames are not hashed. To push a change to an asset immediately, rename the file and update the reference in `index.html`.

## Performance

- `index.html` stays under 14 KB compressed, so it arrives in the first network round trip.
- One stylesheet, loaded in `<head>`. Scripts use `defer`.
- Fonts are preloaded and use `font-display: swap`.
- Effects (scanlines, glitch, chroma) are CSS. Animations use only `transform` and `opacity` and stop under `prefers-reduced-motion`.

## Security headers

Set in `_headers` on every response:

| Header | Value | Effect |
|---|---|---|
| `Content-Security-Policy` | `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; require-trusted-types-for 'script'; upgrade-insecure-requests` | Only our own files load or run. No inline scripts or styles, no framing, no form posts, no HTML injection through DOM APIs. |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | HTTPS only, enforced by the browser for two years |
| `X-Content-Type-Options` | `nosniff` | Files are only treated as their declared type |
| `Referrer-Policy` | `no-referrer` | No referrer sent to other sites |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Browser features the page doesn't use are off |
| `Cross-Origin-Opener-Policy` | `same-origin` | Other sites can't hold a reference to our window |
| `Cross-Origin-Resource-Policy` | `same-origin` | Other sites can't embed our files |

Any change to the page that breaks under this CSP is changed to fit it; the CSP is not loosened.

## Domain

- HSTS preload list
- DNSSEC
- CAA record limited to the host's certificate authority

## Verification

After each deploy: Mozilla HTTP Observatory and securityheaders.com (target A+), PageSpeed Insights (target 100).

## Open decisions

- **Host:** Cloudflare Pages or Netlify.
- **Domain:** to be decided.
