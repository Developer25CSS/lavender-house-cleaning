# Lavender House Cleaning — Website

Static marketing site for Lavender House Cleaning, serving Colorado statewide.
No build step, no dependencies, no server. Open `index.html` and it runs.

**Live site:** https://www.lavenderhousecleaning.company
**Phone:** 442.588.0028 · **Email:** info@lavenderhousecleaning.company

---

## Quick start

```bash
git clone https://github.com/<your-username>/lavender-house-cleaning.git
cd lavender-house-cleaning
# open index.html in a browser — that's it
```

To preview with a local server (recommended, so paths behave exactly like production):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## Deploying to Cloudflare Pages (what this site actually runs on)

This site is live at [www.lavenderhousecleaning.company](https://www.lavenderhousecleaning.company)
via **Cloudflare Pages**, connected directly to this GitHub repo:

1. Cloudflare Pages project is connected to `Developer25CSS/lavender-house-cleaning` —
   every push to `main` triggers an automatic rebuild and redeploy. No build
   command is needed; it's already plain HTML/CSS/JS.
2. The custom domain `www.lavenderhousecleaning.company` is attached under
   the Pages project's **Custom domains** tab, with DNS managed by Cloudflare.
3. The backend API (`lavender-house-cleaning-api`, a separate repo) is a
   Cloudflare Worker that also auto-deploys from its own `main` via
   Cloudflare Workers Builds. Its `CORS_ORIGIN` includes this domain so
   logged-in requests (login, bookings, `/api/auth/me`) work correctly.

Since deploys are automatic, "deploying" this site just means merging a PR
to `main` — there's no manual `wrangler pages deploy` or dashboard upload
step in normal use. The `CNAME` file in this repo is a leftover from an
earlier GitHub Pages setup; Cloudflare Pages ignores it, so it's harmless
to leave in place.

The GitHub Pages instructions below are kept for reference (e.g. if this
site is ever forked or moved), but are not how the live site is served.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**.
4. Branch: `main`, folder: `/ (root)`. Save.
5. Your site goes live at `https://<username>.github.io/<repo>/` within a minute or two.

### Custom domain

1. In **Settings → Pages → Custom domain**, enter your domain (e.g. `lavenderhousecleaning.com`).
2. At your domain registrar, add these DNS records:

   | Type  | Name | Value |
   |-------|------|-------|
   | A     | @    | 185.199.108.153 |
   | A     | @    | 185.199.109.153 |
   | A     | @    | 185.199.110.153 |
   | A     | @    | 185.199.111.153 |
   | CNAME | www  | `<username>.github.io` |

3. Tick **Enforce HTTPS** once the certificate is issued.

Every path in this site is **relative**, so it works at a root domain or in a
subfolder without any changes.

---

## Connecting Stripe (the only setup step required)

The payment page works right now without Stripe — the buttons hand the customer a
pre-filled text message containing their exact quote, so you can still take the
booking. To switch on real card checkout:

1. Create a free account at [stripe.com](https://stripe.com).
2. Go to **Payments → Payment Links → New**.
3. Create three links:
   - **Deposit** — fixed price, $50
   - **Pay in full** — enable *"Let customers choose what they pay"*
   - **Invoice / balance** — also customer-chooses-amount
4. Open `payment.html`, scroll to the bottom, and paste the URLs:

```js
var STRIPE = {
  deposit: "https://buy.stripe.com/xxxxxxxxxxxx",
  full:    "https://buy.stripe.com/yyyyyyyyyyyy",
  invoice: "https://buy.stripe.com/zzzzzzzzzzzz"
};
```

5. Delete the yellow **"Owner setup"** box on that page before going live.

The buttons switch to Stripe checkout automatically once the links are filled in.
No other edits needed.

### Stripe branding

**Settings → Business → Branding**

| Field | File |
|---|---|
| Icon | `brand/stripe/stripe-icon-512.png` |
| Logo | `brand/stripe/stripe-logo-1024.png` |
| Brand colour | `#995ec9` |
| Accent colour | `#a98cb1` |

---

## About "API" and "SaaS"

Being straight about scope, because it affects what you should promise customers:

**This is a static website, not a SaaS application.** There is no backend, no
database, no user accounts, and no API of our own. That is a deliberate choice —
it makes the site free to host, impossible to hack in the usual ways, and fast.

**No API is needed for payments.** Stripe Payment Links are hosted by Stripe. The
customer leaves your site, pays on Stripe's page, and Stripe emails you both. You
never handle card data, which keeps you in **PCI SAQ-A** scope — the lightest
compliance tier there is.

**What would require a real backend** (a separate project, if you ever want it):

- Customer accounts and login
- A live booking calendar with real availability
- Automatic crew dispatch and route scheduling
- Recurring billing and subscriptions
- SMS reminders sent automatically
- A dashboard showing revenue and job history

If you get there, the natural path is Stripe Checkout + a small Node or Python
API, or an off-the-shelf tool like Jobber or Launch27. Worth revisiting once
booking volume justifies the monthly cost.

---

## File map

```
index.html            Home — hero, before/after sliders, detail close-ups, gallery
services.html         Full service list and flat-rate pricing table
service-areas.html    149 Colorado cities across 8 regions
booking.html          Call / text / online booking + quote request form
payment.html          Live quote builder and Stripe checkout   <-- setup here
hiring.html           Recruiting page, $27/hr, application form
privacy.html          Privacy Policy
terms.html            Terms of Service
refund-policy.html    Refund & Cancellation Policy

style.css             All styling, single file
site.js               Navigation drawer, sliders, gallery, animations
site.webmanifest      Add-to-home-screen config

assets/               Favicons, app icons, social preview image
brand/                Logo kit — Stripe, social, print, favicons
brand/Lavender_Pricing_Calculator.xlsx   Owner-only pricing model
```

All photographs are embedded directly in the HTML as data URIs, so no image can
break from a moved or missing file.

---

## Editing common things

| To change | Where |
|---|---|
| Phone number | Find & replace `442.588.0028` and `14425880028` across all `.html` |
| Prices | `services.html` table, `payment.html` (both the table and the `PRICES` object in JS) |
| Deposit amount | `payment.html` → `var DEPOSIT = 50;` |
| Service areas | `service-areas.html` |
| Cleaner wage claim | `hiring.html` and the pricing note in `services.html` |
| Colours | `style.css` → `:root` at the top |

**If you change prices, update them in three places** so the site stays
consistent: the table in `services.html`, the table in `payment.html`, and the
`PRICES` object in `payment.html`'s script.

---

## Accessibility

- Skip-to-content link and a proper `<main>` landmark on every page
- Mobile menu exposes `aria-expanded` / `aria-controls`, traps focus, closes on Escape
- Every interactive element meets the 44px minimum touch target
- Visible keyboard focus rings throughout
- Honours `prefers-reduced-motion`
- Pinch-zoom is never blocked

## Browser support

Current Chrome, Safari, Firefox and Edge, on desktop and mobile. Degrades
gracefully without JavaScript — all content stays visible and every link works.

---

## Before you go live

- [ ] Paste the three Stripe Payment Link URLs into `payment.html`
- [ ] Delete the yellow "Owner setup" box on the payment page
- [ ] Have a Colorado attorney review `privacy.html`, `terms.html` and `refund-policy.html`
- [ ] Confirm employee classification and workers' comp with an accountant before hiring
- [ ] Replace any photos that are not your own work
- [ ] Set the live URL at the top of this README

---

© 2026 Lavender House Cleaning. Serving Colorado statewide.
