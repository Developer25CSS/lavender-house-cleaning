# Adding Before & After Photos

You never touch the website code. You add a picture and one line of text.

Everything on the homepage — the sliders, the close-ups, the gallery — is built
from **`photos.json`** in this folder.

---

## The 3-step routine

1. **Upload the photo** into this `photos/` folder on GitHub
   (open the folder → **Add file → Upload files** → drag it in → **Commit changes**)
2. **Open `photos.json`** → click the pencil ✏️ to edit
3. **Add your entry**, commit, done. The site updates in about a minute.

---

## Adding a Before & After pair

Upload two photos, e.g. `smith-kitchen-before.jpg` and `smith-kitchen-after.jpg`.

Then in `photos.json`, inside the `"beforeAfter"` list, add:

```json
{
  "before": "smith-kitchen-before.jpg",
  "after": "smith-kitchen-after.jpg",
  "title": "Kitchen Deep Clean",
  "caption": "Counters degreased, appliances shined, floors mopped"
}
```

**Commas matter.** Every entry needs a comma after it *except the last one*:

```json
"beforeAfter": [
  { "before": "a-before.jpg", "after": "a-after.jpg", "title": "Kitchen",  "caption": "..." },
  { "before": "b-before.jpg", "after": "b-after.jpg", "title": "Bathroom", "caption": "..." }
]
```

## Adding a single "after" photo to the gallery

```json
{
  "file": "jones-living-room.jpg",
  "title": "Living Rooms",
  "caption": "Floors mopped, surfaces dusted"
}
```

Put it in the `"gallery"` list.

## Adding a grime close-up

Same shape, but in the `"details"` list. These are the shots that sell the job —
greasy oven vents, scaled faucets, mildewed window tracks.

## Changing the big photo at the top

Replace `hero.jpg` with your own (keep the same filename), or change the
`"file"` value under `"hero"`.

## Adding more photos to the big photo at the top (up to 4)

The big hero photo can hold up to 4 pictures that slowly crossfade into each
other in the background — no clicking, no arrows, just ambient movement.
This is controlled by the `"heroSlides"` list:

```json
"heroSlides": [
  { "file": "hero.jpg", "alt": "Beautifully cleaned high-end living room" },
  { "file": "before-after-composite.jpg", "alt": "Living room before and after" }
]
```

Add up to 4 entries total (same shape as above — `"file"` and `"alt"`). One
entry means no animation, just a still photo. Two or more and they'll
automatically fade between each other every 7 seconds once the page is live.

---

## Photo tips

- **Shoot from the same spot** for before and after. Same angle, same height.
  It makes the slider dramatic instead of confusing.
- **Landscape (sideways)** works best for the sliders.
- **Lights on, blinds open.** Bright photos look clean; dark ones look grim.
- **Resize before uploading.** About 1200px wide is plenty. Straight-from-phone
  photos are 4000px and will slow your site down.
- **Never upload a photo of a client's home without their permission.** Say so
  in writing when you book them, or crop out anything identifying — mail,
  photos on the wall, house numbers.

---

## If the photos disappear

You almost certainly broke the JSON — a missing comma or quote. Check
`photos.json` at [jsonlint.com](https://jsonlint.com): paste it in, hit Validate,
and it will point at the line. Fix, commit, and the photos come back.

Nothing is ever lost. GitHub keeps every version — click **History** on the file
to restore an earlier one.
