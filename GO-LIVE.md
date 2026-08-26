# Go Live — lavendercleaningco.com

Four steps, about 30 minutes of your time plus waiting for DNS.

---

## Step 1 — Upload the files to GitHub  (5 min)

Your repo already exists: **github.com/Developer25CSS/lavender-house-cleaning**

1. Go to the repo → **Add file → Upload files**
2. Select everything in this folder **except `_archive`** — including the
   `assets/` and `photos/` folders and the `CNAME` file
3. Commit message: `Initial site`
4. Click **Commit changes**

> The `CNAME` file has no extension and is easy to miss. Make sure it uploads —
> without it the custom domain will not work.

---

## Step 2 — Turn on GitHub Pages  (1 min)

1. Repo → **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` · **Folder:** `/ (root)` → **Save**

Your site is live within a minute or two at:
`https://developer25css.github.io/lavender-house-cleaning/`

**Check it works there before adding the domain.** If something's broken, it's
easier to diagnose without DNS in the mix.

---

## Step 3 — Buy the domain  (5 min, ~$11)

Go to **[cloudflare.com/products/registrar](https://www.cloudflare.com/products/registrar/)**
or **[porkbun.com](https://porkbun.com)** and register:

```
lavendercleaningco.com
```

Both sell at cost with free WHOIS privacy and no renewal price jump.
Skip the upsells — you do not need their hosting, email, SSL or site builder.

---

## Step 4 — Point the domain at your site  (5 min + waiting)

In your registrar's **DNS** settings, add these five records:

| Type  | Name | Value                    |
|-------|------|--------------------------|
| A     | @    | 185.199.108.153          |
| A     | @    | 185.199.109.153          |
| A     | @    | 185.199.110.153          |
| A     | @    | 185.199.111.153          |
| CNAME | www  | developer25css.github.io |

> On Cloudflare, set each record's proxy status to **DNS only** (grey cloud),
> not the orange cloud. GitHub handles the certificate itself.

Then back on GitHub: **Settings → Pages → Custom domain** → enter
`lavendercleaningco.com` → **Save**.

Wait for the DNS check to pass — usually 10 minutes to an hour, occasionally up
to 24. Once it does, tick **Enforce HTTPS**.

---

## Then you're live at https://lavendercleaningco.com

---

# After launch

### Connect Stripe (required before you can take card payments)

1. stripe.com → **Payments → Payment Links** → create three links:
   - $50 deposit (fixed price)
   - Pay in full (turn on *"Let customers choose what they pay"*)
   - Invoice / balance (customer chooses amount)
2. In GitHub, open `payment.html` → click the pencil ✏️ → scroll to the bottom →
   paste your URLs into the `STRIPE` block → **Commit changes**
3. Delete the yellow "Owner setup" box on that page
4. **Settings → Business → Branding** in Stripe:
   - Icon: `brand/stripe/stripe-icon-512.png`
   - Logo: `brand/stripe/stripe-logo-1024.png`
   - Brand colour `#995ec9` · Accent `#a98cb1`

Until you do this, the pay buttons hand the customer a pre-filled text message
with their exact quote — so you can still take the booking.

### Get found on Google  (do this on day one — it matters more than the website)

1. **Google Business Profile** — [business.google.com](https://business.google.com).
   Free, and it's what puts you in the map results. Use
   `brand/social/google-business-1200x1200.png` as the logo. Add real photos of
   your work. Ask every happy client for a review.
2. **Google Search Console** — [search.google.com/search-console](https://search.google.com/search-console).
   Add your domain, then submit `https://lavendercleaningco.com/sitemap.xml`.
3. **Bing Webmaster Tools** — same idea, five minutes, some customers use it.

Your site already includes structured data telling Google you're a house
cleaning service, your phone number, hours, prices and the 34 Colorado cities
you serve. That helps, but the Business Profile does the heavy lifting for local
search.

### Adding photos from then on

See `photos/HOW-TO-ADD-PHOTOS.md`. Short version: upload the picture to the
`photos/` folder, add a few lines to `photos.json`, commit. Site updates in
about a minute.

---

# Still to do before taking real money

- [ ] Paste the three Stripe links into `payment.html`
- [ ] Have a Colorado attorney review `privacy.html`, `terms.html`, `refund-policy.html`
- [ ] Confirm employee classification, workers' comp and wage rules with an accountant
- [ ] Replace any photo that is not your own work
- [ ] Get business insurance and bonding in place before the first job

---

# If something goes wrong

**Site shows a 404 after enabling Pages** — give it five minutes; the first
build takes a moment. Check Settings → Pages says "Your site is live at…".

**Custom domain says "not properly configured"** — DNS hasn't propagated yet.
Wait, then click **Check again**. Verify at
[dnschecker.org](https://dnschecker.org) that the A records point to those four
GitHub IPs.

**Photos don't appear** — `photos.json` probably has a syntax error. Paste it
into [jsonlint.com](https://jsonlint.com) to find the missing comma.

**You broke something** — GitHub keeps every version. Open the file → **History**
→ pick an earlier version → restore. Nothing is ever permanently lost.
