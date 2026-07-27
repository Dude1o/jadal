# Achievements API Reference

Covers every achievement-related endpoint after the catalog + per-user-assignment redesign. Mobile/public
endpoints kept their exact existing shape; everything under `/admin/...` is new or changed. All routes
require `Authorization: Bearer <sanctum token>`.

## What changed, in one paragraph

Achievements used to be one row per user per earned achievement (`name` + `rank` + `image_url` +
`awarded_at`, directly on a `user_id`). They're now a shared **catalog** (`name` + `type` + `image_url`,
no owner) plus a **junction** (`achievement_assignments`: `user_id` + `achievement_id` + `assigned_at` +
`assigned_by`), so the same catalog entry (e.g. "Best Speaker — Regional Finals") can be awarded to many
users without duplicating its name/type/image each time, and every award now records which admin gave it.
The 5 types are a static enum: `GOLD | SILVER | BRONZE | HONORABLE | PARTICIPATION` — note `HONORABLE`
replaces the old `honoring` value (the product's own taxonomy renamed that tier; every other value just
changed casing). A user can never be assigned the same catalog achievement twice (enforced at the DB level).

## Data model

**Catalog** (`achievements`): `id`, `name` (string), `type` (`GOLD|SILVER|BRONZE|HONORABLE|PARTICIPATION`),
`image_url` (string|null — resolved to an absolute URL in every response), `created_at`, `updated_at`.

**Assignment** (`achievement_assignments`): `id`, `user_id`, `achievement_id`, `assigned_at` (ISO 8601),
`assigned_by` (the admin's user id — `null` on legacy rows migrated before this feature existed).

Sorting everywhere achievements are ranked: **type priority first** (gold → silver → bronze → honorable →
participation), **then most-recently-assigned first** within the same type.

## Envelope

```json
{ "success": true, "message": "…عربي… | …English…", "data": { ... } }
```

---

## Mobile / public — UNCHANGED shape

### 1. List a user's achievements

```
GET /api/users/{user}/achievements
```
Any authenticated user (no ownership/admin gate — same as the rest of the public profile). Paginated,
`per_page` (default 15, clamped 1–100).

**Response `data`** (array, same shape as before the redesign):
```json
[
  { "id": 9, "user_id": 42, "name": "Best Speaker — Regional Finals",
    "rank": "gold", "image_url": "https://.../storage/achievements/xxx.png",
    "awarded_at": "2026-06-01T00:00:00+00:00" }
]
```
- `id` is now the **assignment's** id (not a catalog id) — preserves the old "one row per instance" meaning.
- `rank` is the catalog `type`, lowercased for backward compatibility. **The one unavoidable value change**:
  `honoring` → `honorable` (the taxonomy itself was renamed; nothing else changed).
- `awarded_at` is now the assignment's `assigned_at`.

### 2. Top achievements embedded in the profile

```
GET /api/users/{user}
```
`data.top_achievements` — same shape as above, capped at the user's top 4.

---

## Admin — Achievement catalog (all NEW)

```
GET    /api/admin/achievements
POST   /api/admin/achievements
GET    /api/admin/achievements/{achievement}
PUT    /api/admin/achievements/{achievement}
DELETE /api/admin/achievements/{achievement}
```
Admin only (`403` otherwise). Not paginated — a small, curated reference list; the dashboard groups it
by type/date client-side.

**Catalog object shape** (`AchievementCatalogResource`):
```json
{
  "id": 3, "name": "Best Speaker — Regional Finals", "type": "GOLD",
  "image_url": "https://.../storage/achievements/xxx.png",
  "assigned_count": 12,
  "created_at": "2026-07-16T10:00:00+00:00", "updated_at": "2026-07-16T10:00:00+00:00"
}
```
`assigned_count` = how many users currently hold it (lets the dashboard show "assigned to N users"
without a second call).

### `GET /admin/achievements` — list
Returns every catalog entry, newest-created first.

### `POST /admin/achievements` — create
| Field | Type | Required |
|---|---|---|
| `name` | string, max 255 | yes |
| `type` | `GOLD\|SILVER\|BRONZE\|HONORABLE\|PARTICIPATION` | yes |
| `image` | image file (jpg/jpeg/png/webp, max 2MB) | no |

`201` with the created catalog object. `422` on missing/invalid fields.

### `GET /admin/achievements/{achievement}` — show
`200` with the catalog object (incl. `assigned_count`). `404` if it doesn't exist.

### `PUT /admin/achievements/{achievement}` — update
| Field | Type | Behavior |
|---|---|---|
| `name` | string, max 255 | optional — updates if sent |
| `type` | one of the 5 | optional — updates if sent |
| `image` | image file | **present as a file** → adds/replaces the image |
| `image` | `""` (empty) | **removes** the current image (old file deleted if locally stored) |
| — | (key omitted) | image is **left untouched** |

Only these three `image` states are meaningful — there's no separate "remove" flag; presence/value of
`image` itself carries the intent. `200` with the updated catalog object.

### `DELETE /admin/achievements/{achievement}` — delete
Blocks deletion while the achievement is still assigned to anyone:
```json
{ "success": false, "message": "...", "errors": { "assigned_count": 12 } }
```
`409` in that case. Pass `?force=true` to delete it **and** every existing assignment in one go (`200`).
`403` non-admin.

---

## Admin — awarding (per-user assignment)

```
GET    /api/admin/users/{user}/achievements/available   (NEW)
POST   /api/admin/users/{user}/achievements              (CHANGED)
DELETE /api/admin/users/{user}/achievements/{achievement} (CHANGED)
```
Admin only. To see what a user **already** has, use the unchanged mobile endpoint
`GET /users/{user}/achievements` (no admin restriction on it — any authenticated user, admins included,
can already call it).

### `GET /admin/users/{user}/achievements/available` — NEW
Catalog achievements this user does **not** yet have — feeds the "give an achievement" picker so it can
hide what they already hold. Returns an array of catalog objects (same shape as the catalog list).

### `POST /admin/users/{user}/achievements` — CHANGED
Before: body was `{name, rank, image_url?, awarded_at?}` and created a brand-new achievement row inline.
**Now**: body is just a reference to an existing catalog entry:

| Field | Type | Required |
|---|---|---|
| `achievement_id` | int, must exist in the catalog | yes |

**Response** (`201`):
```json
{
  "id": 55, "user_id": 42,
  "achievement": { "id": 3, "name": "Best Speaker — Regional Finals", "type": "GOLD", "image_url": "...", "assigned_count": 13, ... },
  "assigned_at": "2026-07-16T10:00:00+00:00",
  "assigned_by": { "id": 1, "name": "Admin Name", "role": "admin", "avatar_url": null, "points": 0, "created_at": "..." }
}
```
**Errors**: `422` missing/invalid `achievement_id`; `409` if the user already has this achievement
(duplicate assignment — rejected, never silently ignored); `403` non-admin.

### `DELETE /admin/users/{user}/achievements/{achievement}` — CHANGED
Before: `{achievement}` was the achievement row's own id (one row = one user, so this fully deleted it).
**Now**: `{achievement}` is a **catalog** id — this only removes *this user's* assignment; the catalog
entry and everyone else's assignment of it are untouched.

`200` on success. `404` if this user does not currently have this achievement. `403` non-admin.

---

## Migration note (for whoever deploys this)

Every achievement that existed before this redesign was preserved losslessly: each old row became its own
catalog entry (name/type/image) plus one assignment (to the same user, at the same `awarded_at`). Nothing
was merged, so if several users previously had identically-named achievements, the catalog will show one
entry per historical row rather than one shared entry — consolidate manually via the new admin API if
desired. Migrated rows have `assigned_by = null` (the old schema never recorded who awarded them).
