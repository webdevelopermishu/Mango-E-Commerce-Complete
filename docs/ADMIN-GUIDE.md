# Admin handbook

Sign in at `https://<your-domain>/admin`. The left menu is grouped as below.

| Group | What's inside |
|---|---|
| **Dashboard** | Live orders, booked vs collected revenue, pending/completed, low-stock list, recent orders, sales chart (7/30/90/365 days) |
| **Catalog** | Products, Categories |
| **Inventory** | Stock adjustments (the stock ledger) |
| **Sales** | Orders, Payments, Customers, Coupons |
| **Content** | Homepage, Video posts, Video files, Media, FAQs, Testimonials, Pages (policies), Blog posts, Redirects |
| **Website Settings** | Branding, Contact & WhatsApp, Header & footer (menus, footer columns), Delivery, Payments, Analytics |
| **Settings** | Staff users |

Roles: **admin** — everything incl. staff and payment settings · **manager** — catalog, content, orders,
customers, stock · **editor** — catalog and content only.

## Bangla and English

Every translatable field shows `— বাংলা` or `— English` next to its label. Switch language with the
**Locale** menu at the top right of any edit screen, edit, and **Save** — each language is saved separately.

- Bangla is the default language and must be filled in. English can be added later; until then the English site
  shows the Bangla text for that field.
- Products, categories, FAQs, pages and posts have a **Translation** column/filter (Complete / Missing English…)
  so you can find what still needs translating.
- Interface text (buttons, checkout messages, etc.) is part of the code in `src/lib/i18n/dictionaries/`.

## Bold words in headings

Homepage headings, the hero headline and section titles support **double asterisks** for the bold part, like the
reference design: `আমাদের **ক্যাটাগরিসমূহ**` shows "আমাদের" light and "ক্যাটাগরিসমূহ" bold (in English the marked
words turn mango-orange). Without asterisks the whole heading is shown at a normal weight.

## Video posts

*Content → Video posts* — short clips for the homepage **reels** row, the **brand story** (phone-style reel), an
optional **hero video**, the `/videos` page, and the pages of the products they're linked to.

1. **Upload the clip**: in the post's *File* field (or first under *Content → Video files*). MP4 with H.264 works
   everywhere. Vertical **1080×1920** for reels, **1920×1080** for a hero video. 15–60 seconds, ideally under 30 MB
   (limit 60 MB by default). Sound is off until a visitor taps the video.
2. **Poster** — a cover image shown while the video loads (a frame from the clip is ideal).
3. **Title** (shown over the video), **label** (small tag beside the brand name, e.g. "প্রতিষ্ঠাতার কথা") and an
   optional **caption** shown in the full-screen player — in both languages.
4. **Products** — the first one gets a "কিনুন / Shop" button; the video also appears on each linked product's page.
5. **Orientation** (vertical reel or wide), **Show in reels**, **Sort order**, and Published/Draft.

Then choose where it appears in *Content → Homepage*: *Story, video & promo → Brand story → Video* (vertical),
*Top → Hero → Hero video* (wide), and *Video reels* (pick posts in order, or leave empty for all "Show in reels" posts).

Videos autoplay only while on screen and muted, and never for visitors who use reduced-motion or data-saver settings.

## Products

- **Content** tab: name, short description (cards and search results), full description, images (drag to
  reorder — the first image is the main one; set alt text in each image), attributes (e.g. Origin, Season).
- **Prices & stock** tab: one row per pack size (variant) — label ("৫ কেজি" / "5 kg"), SKU, size + unit,
  regular price, optional sale price with optional start/end dates, low-stock threshold.
  **Stock is not typed directly** after creation: add/remove stock in *Inventory → Stock adjustments* so every
  change is recorded (orders and cancellations write entries automatically).
- **SEO** tab: title, meta description, social image, canonical URL, "noindex". Empty = generated automatically.
- Sidebar: slug (changing it automatically redirects the old URL), status (Published / Draft), categories, tags,
  Featured (homepage), Best seller (Popular), Bundle.
- List view: search, filters, bulk edit/publish/delete, **Duplicate** (in the ⋮ menu), CSV export/import buttons.
- Products that appear in orders can't be deleted (history is preserved) — set them to Draft instead.

## Category cards

Each category's **Card design** tab controls how it looks on the homepage:

- **Cut-out image** — a transparent PNG/WebP of the product with no background (about 1000×1000 px). It floats over
  the card's top-left corner and lifts on hover. Without one, the normal category image is used.
- **Card colour** — a soft pastel, e.g. `#FFF1CF`.
- **Subtitle** — the small capitals line, e.g. "FRESH MANGO" (per language). Empty = the name in the other language.
- **Coming soon** — show "শীঘ্রই / Coming soon" instead of the live product count (e.g. out of season).

Card order follows *Content → Homepage → Products → Categories section* (or each category's sort order).

## Orders

Order status (Pending → Confirmed → Processing → Shipped → Delivered, or Cancelled) is separate from payment
status (Unpaid / Paid / Failed / Refunded…). Every change is logged in the order's history.
**Cancelling restores the stock.** Use **Print invoice** on an order and **Export CSV** on the list.
For cash on delivery, mark the payment **Paid** when the courier remits the money.

## Website Settings

- **Branding** — website title (browser tab), brand name & tagline, main/mobile/footer logos, favicon, brand
  colours, default SEO title/description and social image, phone, email, address, social links.
- **Contact & WhatsApp** — WhatsApp number with country code (e.g. 8801XXXXXXXXX), on/off, default messages
  in both languages, tooltip, left/right position and which pages show the button. Hidden until a number is set.
- **Delivery** — zones (districts, fee, free-delivery threshold, estimate), delivery methods and surcharges,
  and the delivery note on product pages.
- **Payments** — cash on delivery (with optional maximum order value) and SSLCommerz / bKash / Nagad switches.
  A gateway only appears at checkout when its server credentials are installed (status is shown here).
- **Analytics** — GA4 ID, GTM ID, Search Console verification, cookie-consent requirement.

## Homepage

*Content → Homepage* has every section in page order: announcement bar, hero (headline, text, buttons, image or
video, seasonal badge), trust benefits, category showcase, featured mangoes, scrolling strip (short phrases),
traditional-food rows (choose categories and order), promo banner, brand story (steps + reel), video reels,
popular products & bundles, testimonials, FAQ and homepage SEO.
Each section can be turned off.

## Photos

Upload JPEG/PNG/WebP (ideally 1600 px or larger, square for products). The site creates optimised sizes
automatically. The seeded images are illustrations — replace them with real product photography.

## Reviews

Add genuine customer reviews in *Content → Testimonials* and set them to Published. Only published reviews
appear. Don't publish invented reviews.

## Hero title font

The Bangla hero title can use a custom font (set up for **Li Abu J M Akkas**). Upload the font file to the
`fonts` folder inside your media folder (`MEDIA_DIR`), named exactly `li-abu-jm-akkas.woff2` (or `.ttf`).
No rebuild or restart is needed; refresh the page. Without the file, the title uses an extra-bold Noto Serif Bengali.
Make sure the font's licence allows use on a website.
