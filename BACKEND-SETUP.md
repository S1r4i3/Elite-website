# Elite B Tax Services — Backend & Go-Live Guide

Two applications, one database:

```
┌──────────────────────────┐        Bearer ADMIN_API_TOKEN        ┌───────────────────────────┐
│  WEBSITE (elite-tax-     │ <──────────────────────────────────  │  ADMIN DASHBOARD          │
│  website)                │      /api/v1/admin/*                 │  (ebt-admin)              │
│                          │                                      │                           │
│  • public pages          │                                      │  • sidebar admin panel    │
│  • Subscribe pop-up      │                                      │  • reads live site data   │
│  • register / login      │                                      │  • shares drafts & finals │
│  • CLIENT DASHBOARD      │                                      │  • CMS/employees = local  │
│  • PostgreSQL + S3       │                                      │                           │
└──────────────────────────┘                                      └───────────────────────────┘
```

The **website owns all client data**. The admin dashboard has no database of its own for
clients — it calls the website's API. That means there is only ever one copy of a client,
a document or an inquiry, and nothing can drift out of sync.

---

## 1. What the backend does now

| Flow | What happens |
|---|---|
| **Subscribe pop-up** | `POST /api/inquiries` → saved to `inquiries` → emailed to `NOTIFY_EMAIL` → shows in the admin dashboard under *Website Inquiries* |
| **Register** | `POST /api/auth/request-otp` (`mode: "register"`) → account held pending → **"Verify Email Address"** email → clicking the link calls `POST /api/auth/verify-email` → account created, client ID `EBT-2026-0001` assigned, signed in |
| **Login** | `POST /api/auth/login` — email + password (scrypt), signed httpOnly session cookie |
| **Forgot password** | `mode: "reset"` → 6-digit code by email → `POST /api/auth/reset-password` |
| **Client uploads** | `POST /api/me/documents` → stored privately → visible to admin instantly |
| **Admin shares a draft/final** | Admin dashboard → website `POST /api/v1/admin/clients/{id}/documents` → appears in the client's dashboard **and emails the client** |
| **Client approves / requests changes** | `PATCH /api/me/drafts/{id}` → the new status shows in the admin dashboard |

---

## 2. The admin API (new)

Base URL: `https://your-site/api/v1/admin`
Every request needs the header:

```
Authorization: Bearer <ADMIN_API_TOKEN>
```

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/ping` | Check the URL + token are right |
| GET | `/stats` | Counters for the dashboard home |
| GET | `/clients?search=&limit=&offset=` | Every registered client |
| GET | `/clients/{id}` | One client + their uploads / drafts / finals |
| PATCH | `/clients/{id}` | Update name, phone, dob, state, country, address |
| GET | `/clients/{id}/documents?kind=` | That client's documents |
| POST | `/clients/{id}/documents` | **Share a draft or final** (multipart: `file`, `kind=draft\|final`, `note`, `taxYear`) |
| GET | `/documents?kind=&clientId=` | All documents across clients |
| GET | `/documents/{id}` | One document's details |
| GET | `/documents/{id}/file` | Download the file (`?view=1` = inline) |
| PATCH | `/documents/{id}` | Change `note` or draft `status` |
| DELETE | `/documents/{id}` | Delete the record and the stored file |
| GET | `/inquiries` | Subscribe pop-up submissions |
| GET | `/leads` · GET `/leads/{id}` · PATCH `/leads/{id}` | "Get Started" form submissions |

Quick check once deployed:

```bash
curl -H "Authorization: Bearer $ADMIN_API_TOKEN" https://your-site/api/v1/admin/ping
# {"ok":true,"service":"elite-b-tax-website","driver":"postgres",...}
```

`GET /api/health` (no token) reports database, email, storage and admin-API status —
use it as your first check after every deploy.

---

## 3. Set it up — step by step

### Step 1 · Gmail app password (10 minutes)

Emails will not send with your normal Gmail password. You need an **app password**:

1. Go to **myaccount.google.com → Security**.
2. Turn on **2-Step Verification** (required — app passwords don't exist without it).
3. Still under Security, open **App passwords**.
4. App: *Mail*, Device: *Other* → name it "Elite B Tax website" → **Create**.
5. Copy the **16-character** password Google shows (e.g. `abcd efgh ijkl mnop`) — spaces don't matter.

Then in your env file:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youraddress@gmail.com
SMTP_PASS=abcdefghijklmnop        ← the 16-character app password
EMAIL_FROM="Elite B Tax Services <youraddress@gmail.com>"
NOTIFY_EMAIL=youraddress@gmail.com
```

Gmail limits you to roughly **500 emails a day** and mail arrives from your gmail address.
When volume grows, switch to Amazon SES or Resend on your own domain — only these four
variables change.

### Step 2 · PostgreSQL

On Vercel: **Storage → Create Database → Postgres** (Neon). Copy the connection string.
Anywhere else, any Postgres 14+ works.

```
DATABASE_URL=postgres://user:password@host:5432/elite_tax
DATABASE_SSL=true
```

Create the tables (run once, and again after any schema change):

```bash
npm run db:migrate
```

Without `DATABASE_URL` the site silently uses a local JSON file — fine for development,
**never** for production.

### Step 3 · File storage (required on Vercel)

Vercel wipes the filesystem on every deploy, so uploaded tax documents must go to object
storage. Create a **private** bucket (AWS S3, Cloudflare R2, DigitalOcean Spaces or
Supabase Storage) and set:

```
S3_BUCKET=elitebtax-documents
S3_REGION=ap-south-1
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
# non-AWS providers only:
# S3_ENDPOINT=https://<account>.r2.cloudflarestorage.com
```

Leave `S3_BUCKET` empty on a VPS with a real disk and files stay in `UPLOAD_DIR`.
Either way nothing is public — downloads always go through an authenticated route.

### Step 4 · Secrets

```bash
openssl rand -hex 32     # → SESSION_SECRET
openssl rand -hex 32     # → ADMIN_API_TOKEN
```

```
SESSION_SECRET=<first value>
ADMIN_API_TOKEN=<second value>
ADMIN_PASSWORD=<a strong password for /admin on the website>
APP_URL=https://www.elitebtax.com
NEXT_PUBLIC_SITE_URL=https://www.elitebtax.com
```

`APP_URL` is what goes inside the "Verify Email Address" button. Get it wrong and
verification links point at localhost.

### Step 5 · Deploy the website (Vercel)

1. Push the project to GitHub.
2. Vercel → **Add New → Project** → import the repo (framework auto-detects as Next.js).
3. **Settings → Environment Variables** → add every variable from Steps 1–4 for
   *Production* **and** *Preview*.
4. Deploy, then add your domain under **Settings → Domains**.
5. Check `https://your-site/api/health` — everything should read `configured` / `postgres` / `s3`.

### Step 6 · Run the admin dashboard

In the `ebt-admin` folder:

```bash
npm install
cp .env.example .env.local
```

```
SESSION_SECRET=<a third random value>
ADMIN_EMAIL=admin@elitebtax.com
ADMIN_PASSWORD=<your admin password>

SITE_API_URL=https://www.elitebtax.com
ADMIN_API_TOKEN=<the SAME value as on the website>
```

```bash
npm run dev      # http://localhost:4000
```

Sign in. The Dashboard shows a green **"Live — website data"** badge when it is talking to
the website; an orange **"Demo data"** badge means `SITE_API_URL` or `ADMIN_API_TOKEN` is
missing and you are looking at the seeded sample file.

To host it instead of running it locally, deploy it to Vercel as a second project with the
same four variables. Give it a subdomain such as `admin.elitebtax.com`.

---

## 4. Test the whole chain (15 minutes)

1. **Subscribe** — open the site, wait 5 seconds, fill in the pop-up.
   → the inquiry lands in `NOTIFY_EMAIL` and in the admin dashboard under *Website Inquiries*.
2. **Register** — create an account with a real inbox.
   → a "Verify Email Address" email arrives; click it; you land back on the site, signed in,
   with a client ID like `EBT-2026-0001`.
   → the client appears in the admin dashboard under *All Clients*.
3. **Client upload** — in the client dashboard, upload a document.
   → admin sees it under *Client Documents* and on that client's profile page.
4. **Share a draft** — in the admin dashboard, open the client → *Draft estimations* → Upload.
   → the client gets a "Your draft estimation is ready" email, and the file is in their
   *Draft Estimation* tab.
5. **Approve** — as the client, approve the draft.
   → the status turns *approved* in the admin dashboard.

If step 1 or 2 fails, check `/api/health` first: `"email":"not configured"` means the SMTP
variables are missing or the app password is wrong.

---

## 5. Before you go live

- [ ] `SESSION_SECRET` and `ADMIN_API_TOKEN` are long random values, different from each other,
      and set **only** in the hosting dashboard — never committed to git.
- [ ] `.env.local` is in `.gitignore` (it is) and `.env.example` contains no real secrets (it doesn't).
- [ ] **Rotate the Gmail password and the old SES keys that were previously sitting in
      `.env.example`** — treat them as compromised.
- [ ] `npm run db:migrate` has been run against the production database.
- [ ] `S3_BUCKET` is set if you are on Vercel, and the bucket blocks public access.
- [ ] `APP_URL` matches the real domain.
- [ ] The admin dashboard is not reachable from the public internet without a login
      (it isn't — but put it on a subdomain and consider IP-restricting it too).
- [ ] Each employee gets their own login before you hand the admin panel to staff
      (the `employees` collection already stores a `passwordHash`; add a "set password" route).

---

## 6. Where the code lives

**Website**

```
src/lib/api-auth.ts          Bearer-token check for the admin API
src/lib/api-shapes.ts        the JSON shapes the admin API returns
src/lib/db/                  repository: types.ts, file-store.ts, postgres-store.ts
src/lib/storage.ts           local disk or S3 (SigV4, no SDK)
src/lib/email.ts             verification, OTP, "document ready", inquiry alert
src/lib/notify.ts            hooks fired when a lead/inquiry/document is created
src/app/api/v1/admin/        the admin API
db/schema.sql                the database schema
```

**Admin dashboard**

```
lib/live.ts                  the website API client + shape mapping
lib/db.ts                    routes each collection to the website or the local file
lib/sections.ts              one entry per page: columns, form fields, filters
app/api/                     this app's own REST API
```

To swap in a different backend later, `lib/live.ts` (admin) and `src/lib/db/` (website)
are the only files that touch data.
