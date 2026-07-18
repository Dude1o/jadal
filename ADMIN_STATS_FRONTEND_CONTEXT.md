# Admin Platform Statistics — Frontend Build Context

Audience: the React admin-panel developer (and their AI coding agent). This explains **what each
screen is for and how it should feel** — the exact routes, params, shapes and error codes are in
`ADMIN_STATS_API_DOCS.md`; don't re-derive them from here.

Big picture: the platform already has per-debater stats in the mobile app. This module is the
**admin's cross-platform view** — five screens under one "Platform Statistics" section, each with the
same skeleton: a filter bar on top, one main visualization, and an "Export to Excel" button that
downloads exactly the currently-filtered view as a styled spreadsheet (same filters go to the export
URL; the file's header block echoes them, so a downloaded file is self-explanatory out of context).

A note on trust signaling that applies everywhere: every aggregate comes with an `n_debates` (or
equivalent count). Always render it near the number it supports ("72% · 24 debates"), because a rate
over 3 debates and a rate over 300 are very different claims. Data is server-cached ~10 minutes — a
subtle "updated a few minutes ago" hint is honest; a live-refresh spinner is overkill.

---

## 1. Framework Fairness — "are any debate themes rigged?"

**Why an admin looks here**: if motions under some framework (Economic, Social…) keep being won by
the same side, the motions are structurally unfair and the motion pool needs rebalancing. This screen
is the early-warning radar.

**What the params mean to the user**: the date range and format filter scope which debates count.
`min_n_debates` is a noise gate — "don't flag a framework until it has at least N debates" (default 5).

**Suggested viz**: a horizontal diverging bar per framework — proposition win share extending left,
opposition right from a 50% center line — with the `imbalance_score` as a small number beside it.
Rows arrive pre-sorted worst-first. `flagged=true` deserves a red badge; that flag is the whole
point of the screen. A framework where the two win rates don't sum to 1 has draws making up the rest
— fine to show a thin gray "draws" segment. Table fallback is acceptable; chart is better.

**Export button**: downloads the same list; flagged rows come pre-highlighted in the sheet.

---

## 2. Platform Leaderboards — "who should we celebrate?"

**Why**: surfacing rising stars and top performers platform-wide (think monthly shout-outs, picking
mentors, spotting who to nudge toward competitions).

**What the params mean**: `board` is a tab switcher, not a filter — four tabs: Most Improved,
Win Rate, Avg Score, Most Active. Date range + formats scope the window ("best of Ramadan season").
`min_n_debates` keeps one-hit wonders off the board; `limit` is list length (top 10 default).

**Suggested viz**: a classic ranked list/table — rank medal, name, the value, and the n_debates count
muted beside it. On the **Most Improved** tab the value is an abstract index (roughly −100..100);
don't chart it, just show the number plus its `band` as a colored chip
(`strong_upward`/`improving` green shades, `stable` gray, `regressing`/`sharp_decline` red shades).
On Win Rate render % rather than the raw fraction. Two honest-UX notes: Most Improved uses exactly
the same math as the debater's own mobile "improvement" screen, so numbers will match if anyone
cross-checks; and that board silently omits debaters without ≥3 active months — if an expected name
is missing, that's why, not a bug. An info tooltip explaining "needs 3+ active months" saves a
support ticket.

**Export button**: downloads the currently-selected board with the board name baked into the sheet.

---

## 3. Platform Growth & Health — the homepage pulse-check

**Why**: the "how is the platform doing" screen an admin opens first — signups, debate volume,
completion vs. cancellation, and whether active debaters are debating more or less.

**What the params mean**: `group_by` is the x-axis granularity (none = one totals card, year, or
month — month over long unbounded history is rejected by the API, so pair it with a date range
picker; a sensible default is "last 12 months, monthly"). `series` splits the chart into parallel
lines: by user role (only affects the signups metric) or by debate format (affects the debate
metrics) — one at a time, it's an either/or select. `formats` filters the debate metrics.

**Suggested viz**: a small dashboard, not one chart —
- KPI cards for the latest bucket (new users, debates created/completed/cancelled, completion rate);
- a line/area chart of debates created vs. completed per bucket (add per-format lines when
  `series=debate_format` via `by_format`);
- a stacked bar of new users by role per bucket;
- cancellations as a bar with a click-open breakdown of reasons (`cancellation_breakdown`).
Two gotchas: `completion_rate` **may exceed 100%** in a bucket (created and completed are dated
differently — show it plainly, don't cap it, tooltip explains "debates created earlier finished this
month"); and `null` rates mean "no denominator", render an em-dash not 0%.

**Export button**: one sheet, one row per bucket (per-format sub-rows indented under each bucket when
that series is on).

---

## 4. Engagement & Churn Risk — "who's going quiet?"

**Why**: retention. Debaters rarely announce they're leaving — they just stop showing up. This screen
lists every debater with a completed-debate history, classified `churn_risk` / `ramping_up` /
`stable`, so a coach/admin can reach out before they're gone (or feed the ramping ones more debates).

**What the params mean, in plain words**: "recent window" = the last N days we call *now* (30);
"baseline window" = the N days before that we compare against (90); "churn threshold" = how long
quiet counts as at-risk (30). These three are advanced knobs — tuck them behind a settings popover
with the defaults pre-filled. `risk_filter` is the useful everyday control: tabs for All / At Risk /
Ramping Up. The list is paginated (it's every debater on the platform).

**Suggested viz**: a table, definitely — name, a risk chip (red `churn_risk`, green `ramping_up`,
gray `stable`), "days since last debate" (the emotional number — make it prominent), recent count vs.
baseline count. Server pre-sorts most-urgent-first. Row affordance: link through to the existing
per-debater stats/profile screen for context before reaching out.

**Export button**: downloads **all** matching rows (not the current page) — at-risk rows
pre-highlighted. This is the sheet someone takes into a coaches' meeting.

---

## 5. Complaint & Accountability — "who attracts complaints, adjusted for exposure?"

**Why**: raw complaint counts are unfair — a judge who officiated 80 debates will naturally collect
more complaints than one who did 4. This screen normalizes: complaints **per 100 debates** in the
complained-about capacity, so the admin sees genuine outliers, not just the busiest people.

**What the params mean**: `target_role` narrows to one capacity (a person can appear separately as
judge and as chair — that's intentional, chairs carry extra responsibility); `status` narrows to
where complaints currently stand; `min_debates_involved` hides people with too little exposure for a
rate to be meaningful (default 3); dates/formats scope the window.

**Suggested viz**: a table sorted by the per-100 rate (pre-sorted server-side) — name, capacity
chip, the rate as the headline number, raw total + exposure muted beside it ("5 complaints · 40
debates"), then a compact stacked pill of the status breakdown (open/under review/resolved/dismissed).
Show `unattributed_total` as a one-line banner above the table: "+N older complaints have no target
recorded and aren't attributed to anyone" — it keeps totals honest. The
`avg_time_to_last_update_hours_approx` column MUST be labeled "approx." (the schema has no true
resolution timestamp; this is updated_at minus created_at on closed complaints) — render `null` as
an em-dash.

**Export button**: same filtered table; the unattributed count is included at the bottom of the sheet.

**Related form change you also own**: the complaint-filing UI (wherever complaints are created)
should now offer "who is this complaint about?" — a user picker plus a capacity select
(debater/trainer/judge/chair). Both optional, but they go together (the API rejects one without the
other). Complaints filed without a target can never appear in this dashboard's per-person view —
worth a gentle hint in the form.
