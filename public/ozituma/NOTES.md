# Ọzịtụma dashboards — design notes

Plain HTML and CSS. No build step, no preprocessor, no framework, no dependency.
Open `index.html` in a browser and walk through every screen.

```
index.html                      contents page, links every screen
tokens.css                      the custom properties, liftable on their own
styles/dashboard.css            the component layer, shared by both dashboards
screens/contribute-overview.html
screens/contribute-word.html
screens/contribute-submissions.html
screens/review.html
screens/admin-dashboard.html
screens/admin-users.html
screens/admin-appearance.html
screens/admin-analytics.html
NOTES.md                        this file
```

---

## 1. Rationale

An archive earns trust by being plain about what it holds. So the direction is
**paper, not product**: a warm page, serif headings in Libre Baskerville carried
straight over from the public site, IBM Plex Sans for everything that is read
quickly, and no ornament that does not carry information. The public identity is
**kept and extended** rather than replaced — the dashboards should feel like the
back rooms of the same building, not a SaaS console bolted to the side.

The contributor dashboard is reframed around **accumulation**. The old screen
said "submitted"; this one says *29 accepted, 6 waiting, 3 returned to you with a
reason you can act on*, and shows the shape of your own contribution as a single
bar. The six forms are cut into three named parts — required, useful, optional —
with the long tail behind a `<details>` disclosure, so a first-time contributor
sees four fields and a clear end rather than a wall of twenty. A refusal is
designed as carefully as an acceptance: the editor must give a reason, and that
reason is shown to the contributor verbatim beside an "edit and resend" button.

The admin dashboard is the same vocabulary at higher density and lower
temperature: the same type scale, the same badges, the same panels, smaller
padding, full width, monospaced figures. It opens with **"needs attention"**
rather than with counts, because an administrator arrives with a job to do. Lists
gain server-side column sorting (`?sort=`), a GET filter bar, and bulk actions as
plain checkboxes inside a POST form — no JavaScript anywhere in it.

---

## 2. Token proposal

All of `tokens.css` is lift-and-drop into `apps/web/app/globals.css`.

**Unchanged:** `--ink`, `--ink-soft`, `--ink-faint`, `--paper`, `--paper-raised`,
`--line`, `--indigo`, `--ochre`, `--clay`, `--green`, `--red`, `--radius*`,
`--shadow*`, `--font-*`, `--wrap`.

**Changed:** `--ink-soft`, `--ink-faint`, `--paper-raised` and `--line` are now
*derived* with `color-mix()` from `--ink` and `--paper` instead of being fixed
values. This is what makes an admin palette override carry through the whole
dashboard instead of stopping at the two colours they changed.

**Added:**

| token | why |
| --- | --- |
| `--chrome`, `--chrome-raised`, `--chrome-ink`, `--chrome-ink-soft`, `--chrome-line` | the dark sidebar, derived from `--header-bg` so a re-theme moves it too |
| `--canvas-a`, `--canvas-b` | the two dashboard backgrounds: A warmer, B cooler |
| `--state-draft/pending/accepted/refused/published` | one colour semantic shared by both dashboards |
| `--tint-pending/accepted/refused/info` | the matching surfaces for badges and notices |
| `--s-1`…`--s-7` | the 4px spacing rhythm, identical in A and B |
| `--t-xs`…`--t-2xl` | the type scale; B simply uses the lower steps |
| `--focus` | one visible focus ring, used on every interactive element |
| `--row-pad` | the single density knob between A and B |

The six admin-overridable properties and `--wrap` keep their exact names and are
never bypassed. No colour is hard-coded anywhere outside `tokens.css`, and no
layout assumes a page width — `--wrap` governs measure in A, and B is fluid.

---

## 3. Component inventory

Reusable (build once):

| component | class | states covered in the prototype |
| --- | --- | --- |
| Shell | `.shell`, `.shell--admin` | desktop two-column, 375px single column |
| Side navigation | `.sidenav`, `.sidenav__group` (`<details>`) | default, hover, current page, editor-only entry with count, collapsed on mobile |
| Top bar (B only) | `.topbar` | default, with search |
| Page header | `.page-header` | with and without actions |
| Panel | `.panel`, `__head` `__body` `__foot` | default, flush body, with note, with actions |
| Stat | `.stat` | default, `--zero`, `--attention`, linked |
| Badge | `.badge` | pending, accepted, refused, published, draft, hidden, role |
| Button | `.btn` | default, `--primary`, `--quiet`, `--danger`, `--sm`, `--block`, hover, focus, disabled |
| Form field | `.field` | default, focus, hint, required, optional, `--error`, `--disabled`, `--inline` |
| Field group | `.fieldgroup` | numbered step, optional variant |
| Disclosure | `.disclosure` (`<details>`) | closed, open |
| Steps rail | `.steps` | current step |
| Notice | `.notice` | error, success, warning, info |
| Table | `.table` | sortable header, hover row, attention row, hidden row, numeric column, select column |
| Bulk bar | `.bulkbar` | default |
| Filter bar | `.filters` (GET form) | default |
| Pagination | `.pagination` | current, disabled |
| Empty state | `.empty` | full-panel and `--inline` |
| Entry row | `.entry` | default, hover, with badge and action, with nested notice |
| Pairs list | `.pairs` | default, missing value |
| Meter | `.meter` | accepted / pending / refused segments |
| Avatar | `.avatar` | `--sm`, default, `--lg` |
| Skip link | `.skip` | hidden, focused |

One-offs (do **not** generalise): the standing panel on `/contribute`, the
appearance preview block, the analytics bar chart (scoped `<style>` in that file).

---

## 4. Accessibility

- Every input has a bound `<label>`; invisible ones use `.visually-hidden`.
- One `--focus` ring on every focusable element; never removed.
- `<nav aria-label>` on each navigation; `aria-current="page"` on the active item.
- Real `<table>` with `<caption>` and `<th scope>` for all tabular data.
- Disclosures are `<details>`/`<summary>` — keyboard-operable with no script.
- Errors use `role="alert"`, confirmations `role="status"`, and the error notice
  links to the offending field.
- Charts and meters carry `role="img"` with a text description of the figures.
- Contrast is derived from the live palette; `/admin/appearance` refuses a save
  that drops text-on-page below 4.5:1 rather than publishing a broken theme.

---

## 5. Departures from current behaviour

Nothing here renames a field or changes a form action. These are the behavioural
changes the design implies, each one deliberate:

1. **`/contribute` and `/contribute/submissions` are given separate jobs.**
   Overview = your standing, recent decisions, and the editor queue. Submissions =
   the complete, filterable record with the reason behind every decision. The
   overview no longer tries to be a short submissions list.
2. **A refusal now requires a reason.** The refuse action on `/review` posts a
   required `reason`, and that text is shown to the contributor verbatim. If the
   server does not yet store a reason, this needs a column.
3. **Saving a draft.** The word form offers `intent=draft` alongside
   `intent=submit`. If the server has no draft state, drop the draft button —
   nothing else depends on it.
4. **Editors can publish from the form itself** (`intent=publish`) rather than
   submitting and then approving their own entry. Same form, same action, extra
   button, rendered only for editors and administrators.
5. **List sorting is server-side** via a `?sort=` query parameter on the column
   header links. New parameter; no client JS.
6. **Bulk actions on `/admin/users`** post `ids[]` plus an `action` value to a new
   `/api/users/bulk` endpoint. If that endpoint is not wanted, remove the bulk bar
   and the select column; the table is unaffected.
7. **Filter bars are GET forms** on submissions and users, so a filtered view is
   bookmarkable. New query parameters only.
8. **Menu ordering has a no-JavaScript fallback** — a number box per item beside
   the drag handle, posting the same `menu_order[...]` values. The drag helper
   stays as an enhancement.
9. **Appearance refuses a save that fails contrast** rather than accepting it.
   New server-side validation.
10. **`/admin` leads with "needs attention"**, computed from live counts (queue
    depth and age, accounts without a role, hidden entries). These are counts the
    database already holds; nothing is estimated or invented.

No invented statistics appear anywhere. Every number in the prototype is the kind
of figure the database counts live, zero is rendered plainly as zero, and every
list screen ships its real empty state.
